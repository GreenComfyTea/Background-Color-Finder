import type {
  PaletteColor,
  Candidate,
  RGB,
  SearchProgress,
} from "@/types/types";
import { compareCandidates, linearize, linearToOKLab, toHex } from "./color";
import { RGB_COUNT } from "@/constants/constants";

// The range arguments support partitioned/test searches; production always uses the full range.
function searchColors(
  palette: readonly PaletteColor[],
  progress?: SearchProgress,
  start = 0,
  end = RGB_COUNT,
): Candidate[] {
  if (!palette.length || start < 0 || end > RGB_COUNT || start >= end) {
    throw new Error("Invalid search range or palette.");
  }

  const linear = new Float64Array(256);

  for (let i = 0; i < 256; i++) {
    linear[i] = linearize(i);
  }

  const labs = new Float64Array(palette.length * 3);

  for (let i = 0; i < palette.length; i++) {
    labs.set(palette[i].lab, i * 3);
  }

  const best: Candidate[] = [];

  let lastProgress = performance.now();

  for (let value = start; value < end; value++) {
    const r = value >> 16;
    const g = (value >> 8) & 255;
    const b = value & 255;

    const lab = linearToOKLab(linear[r], linear[g], linear[b]);

    let mean = 0;
    let m2 = 0;
    let minimum = Infinity;

    for (let i = 0; i < palette.length; i++) {
      const offset = i * 3;

      const dl = lab[0] - labs[offset];
      const da = lab[1] - labs[offset + 1];
      const db = lab[2] - labs[offset + 2];

      const distance = Math.sqrt(dl * dl + da * da + db * db);
      const delta = distance - mean;

      mean += delta / (i + 1);
      m2 += delta * (distance - mean);

      if (distance < minimum) {
        minimum = distance;
      }
    }

    const deviation = Math.sqrt(Math.max(0, m2 / palette.length));
    const score = mean - deviation;

    if (best.length < 5 || score >= best[best.length - 1].score) {
      const rgb: RGB = [r, g, b];

      const candidate: Candidate = {
        rgb,
        hex: toHex(rgb),
        score,
        mean,
        deviation,
        minimum,
      };

      best.push(candidate);
      best.sort(compareCandidates);

      if (best.length > 5) {
        best.pop();
      }
    }
    if ((value & 8191) === 0 && performance.now() - lastProgress >= 100) {
      progress?.(value - start + 1, end - start);
      lastProgress = performance.now();
    }
  }

  progress?.(end - start, end - start);
  return best;
}

export default searchColors;
