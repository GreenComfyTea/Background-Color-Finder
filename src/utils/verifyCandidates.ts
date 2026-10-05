import { distanceSquared, toHex, toOKLab } from "./color";
import type { Candidate, OKLab, RGB, SearchProgress } from "@/types/types";

// Verify only the final winners against every source pixel; never rerank them.
function verifyCandidates<T extends Candidate>(
  candidates: readonly T[],
  pixels: Uint8ClampedArray,
  background: RGB,
  progress?: SearchProgress,
): (T & { sourceMinimum: number; nearestSourceHex: string })[] {
  if (pixels.length % 4 !== 0) throw new Error("Invalid source pixel data.");
  const candidateLabs: OKLab[] = [];
  const uniqueIndexes = new Map<string, number>();
  const indexes: number[] = [];
  for (const candidate of candidates) {
    let index = uniqueIndexes.get(candidate.hex);
    if (index === undefined) {
      index = candidateLabs.length;
      uniqueIndexes.set(candidate.hex, index);
      candidateLabs.push(toOKLab(candidate.rgb));
    }
    indexes.push(index);
  }
  const minimums = new Float64Array(candidateLabs.length);
  const nearestKeys = new Uint32Array(candidateLabs.length);
  minimums.fill(Infinity);
  nearestKeys.fill(0xffffff);
  const total = pixels.length / 4;
  let visible = 0;
  let lastKey = -1;
  let sourceLab: OKLab = [0, 0, 0];
  let lastProgress = performance.now();
  progress?.(0, total);
  for (let offset = 0; offset < pixels.length; offset += 4) {
    const alpha = pixels[offset + 3] / 255;
    if (alpha !== 0) {
      visible++;
      const rgb: RGB = [
        Math.round(pixels[offset] * alpha + background[0] * (1 - alpha)),
        Math.round(pixels[offset + 1] * alpha + background[1] * (1 - alpha)),
        Math.round(pixels[offset + 2] * alpha + background[2] * (1 - alpha)),
      ];
      const key = (rgb[0] << 16) | (rgb[1] << 8) | rgb[2];
      if (key !== lastKey) {
        sourceLab = toOKLab(rgb);
        lastKey = key;
      }
      for (let i = 0; i < candidateLabs.length; i++) {
        const distance = distanceSquared(candidateLabs[i], sourceLab);
        if (
          distance < minimums[i] ||
          (distance === minimums[i] && key < nearestKeys[i])
        ) {
          minimums[i] = distance;
          nearestKeys[i] = key;
        }
      }
    }
    if ((offset & 262143) === 0 && performance.now() - lastProgress >= 100) {
      progress?.(offset / 4, total);
      lastProgress = performance.now();
    }
  }
  if (!visible) throw new Error("No visible source pixels to verify.");
  const verified: (T & { sourceMinimum: number; nearestSourceHex: string })[] =
    [];
  for (let i = 0; i < candidates.length; i++) {
    const index = indexes[i];
    const key = nearestKeys[index];
    verified.push({
      ...candidates[i],
      sourceMinimum: Math.sqrt(minimums[index]),
      nearestSourceHex: toHex([key >> 16, (key >> 8) & 255, key & 255]),
    });
  }
  progress?.(total, total);
  return verified;
}

export default verifyCandidates;
