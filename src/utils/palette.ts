import {
  MAX_PALETTE_COLORS,
  ERROR_TARGET,
  MAX_ERROR_TARGET,
  MAX_UNIQUE_COLORS,
} from "@/constants/constants";
import type {
  RGB,
  PaletteColor,
  PaletteProgress,
  Palette,
} from "@/types/types";
import { toHex, toOKLab } from "./color";

function createPalette(
  pixels: Uint8ClampedArray,
  background: RGB,
  progress?: PaletteProgress,
  maxColors = MAX_PALETTE_COLORS,
  target = ERROR_TARGET,
  maxTarget = MAX_ERROR_TARGET,
): Palette {
  if (
    pixels.length % 4 !== 0 ||
    !Number.isInteger(maxColors) ||
    maxColors < 1 ||
    maxColors > MAX_PALETTE_COLORS ||
    !Number.isFinite(target) ||
    target < 0 ||
    !Number.isFinite(maxTarget) ||
    maxTarget < 0
  ) {
    throw new Error("Invalid palette settings.");
  }

  const histogram = new Map<number, number>();
  let skipped = 0;
  for (let offset = 0; offset < pixels.length; offset += 4) {
    const alpha = pixels[offset + 3] / 255;
    if (alpha === 0) skipped++;
    else {
      const r = Math.round(
        pixels[offset] * alpha + background[0] * (1 - alpha),
      );
      const g = Math.round(
        pixels[offset + 1] * alpha + background[1] * (1 - alpha),
      );
      const b = Math.round(
        pixels[offset + 2] * alpha + background[2] * (1 - alpha),
      );
      const key = (r << 16) | (g << 8) | b;
      histogram.set(key, (histogram.get(key) ?? 0) + 1);
      if (histogram.size > MAX_UNIQUE_COLORS) {
        throw new Error(
          "This image exceeds the safe limit of 500,000 distinct colors. No pixels were sampled or discarded. Try a smaller or less complex image.",
        );
      }
    }
    if ((offset & 262143) === 0)
      progress?.("scanning", offset / 4, pixels.length / 4);
  }
  const count = pixels.length / 4 - skipped;
  if (!count)
    throw new Error(
      "This image is fully transparent and has no visible pixels to analyze.",
    );
  progress?.("scanning", pixels.length / 4, pixels.length / 4);

  // Compact arrays bound working memory; no source-color objects or N×K matrix.
  const size = histogram.size;
  const keys = new Uint32Array(size);
  const frequencies = new Uint32Array(size);
  const labs = new Float64Array(size * 3);
  const nearest = new Float64Array(size);
  const assignments = new Uint8Array(size);
  nearest.fill(Infinity);
  let index = 0;
  let darkest = 0;
  let lightest = 0;
  for (const [key, frequency] of histogram) {
    keys[index] = key;
    frequencies[index] = frequency;
    const lab = toOKLab([key >> 16, (key >> 8) & 255, key & 255]);
    labs.set(lab, index * 3);
    const darkL = labs[darkest * 3];
    const lightL = labs[lightest * 3];
    if (lab[0] < darkL || (lab[0] === darkL && key < keys[darkest]))
      darkest = index;
    if (lab[0] > lightL || (lab[0] === lightL && key < keys[lightest]))
      lightest = index;
    index++;
  }
  histogram.clear();

  const selected: number[] = [];
  let next = darkest;
  let squaredError = Infinity;
  let maximumSquared = Infinity;
  let lastProgress = performance.now();
  progress?.("grouping", 0, maxColors);
  while (selected.length < maxColors) {
    const groupIndex = selected.length;
    selected.push(next);
    const offset = next * 3;
    let farthest = 0;
    squaredError = 0;
    maximumSquared = -1;
    for (let i = 0; i < size; i++) {
      const source = i * 3;
      const dl = labs[source] - labs[offset];
      const da = labs[source + 1] - labs[offset + 1];
      const db = labs[source + 2] - labs[offset + 2];
      const distance = dl * dl + da * da + db * db;
      // Resolve equal nearest distances by RGB order, not insertion or frequency.
      if (
        distance < nearest[i] ||
        (distance === nearest[i] && keys[next] < keys[selected[assignments[i]]])
      ) {
        nearest[i] = distance;
        assignments[i] = groupIndex;
      }
      squaredError += nearest[i] * frequencies[i];
      if (
        nearest[i] > maximumSquared ||
        (nearest[i] === maximumSquared && keys[i] < keys[farthest])
      ) {
        maximumSquared = nearest[i];
        farthest = i;
      }
    }
    if (performance.now() - lastProgress >= 100) {
      progress?.("grouping", selected.length, maxColors);
      lastProgress = performance.now();
    }
    // Seed both lightness extremes even when the aggregate RMS is already low.
    if (selected.length === 1 && lightest !== darkest && maxColors > 1)
      next = lightest;
    else {
      if (
        (squaredError / count <= target * target &&
          maximumSquared <= maxTarget * maxTarget) ||
        maximumSquared === 0
      )
        break;
      next = farthest;
    }
  }
  progress?.("grouping", selected.length, maxColors);

  const counts = new Uint32Array(selected.length);
  for (let i = 0; i < size; i++) counts[assignments[i]] += frequencies[i];
  const colors: PaletteColor[] = [];
  for (let i = 0; i < selected.length; i++) {
    const source = selected[i];
    const key = keys[source];
    const rgb: RGB = [key >> 16, (key >> 8) & 255, key & 255];
    colors.push({
      rgb,
      lab: [labs[source * 3], labs[source * 3 + 1], labs[source * 3 + 2]],
      hex: toHex(rgb),
      count: counts[i],
    });
  }
  const compareColors = (a: PaletteColor, b: PaletteColor): number =>
    b.count - a.count || a.hex.localeCompare(b.hex);
  colors.sort(compareColors);
  const error = Math.sqrt(squaredError / count);
  const maxError = Math.sqrt(maximumSquared);
  const rmsTargetMet = error <= target;
  const maxTargetMet = maxError <= maxTarget;
  return {
    colors,
    pixels: count,
    skipped,
    uniqueColors: size,
    error,
    maxError,
    rmsTarget: target,
    maxTarget,
    rmsTargetMet,
    maxTargetMet,
    targetMet: rmsTargetMet && maxTargetMet,
  };
}

export default createPalette;
