import type {
  PaletteColor,
  CategoryCandidate,
  RGB,
  SearchProgress,
} from "@/types/types";
import { linearize, linearToOKLab, toHex } from "./color";
import { COLOR_CATEGORIES, RGB_COUNT } from "@/constants/constants";
import { getCategoryMask } from "./categories";

// The range arguments support partitioned/test searches; production always uses the full range.
function searchColors(
  palette: readonly PaletteColor[],
  progress?: SearchProgress,
  start = 0,
  end = RGB_COUNT,
): CategoryCandidate[] {
  if (
    !palette.length ||
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    start < 0 ||
    end > RGB_COUNT ||
    start >= end
  ) {
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

  const best: (CategoryCandidate | undefined)[] = new Array(
    COLOR_CATEGORIES.length,
  );

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
    const score = minimum * Math.max(0, mean - deviation);

    let mask = getCategoryMask(r, g, b, lab);
    while (mask !== 0) {
      const bit = mask & -mask;
      const categoryIndex = 31 - Math.clz32(bit);
      mask ^= bit;
      const previous = best[categoryIndex];
      // Exactly the shared score/minimum/deviation/RGB ordering, without
      // allocating a candidate for ties or colors that cannot improve a slot.
      const previousValue = previous
        ? (previous.rgb[0] << 16) | (previous.rgb[1] << 8) | previous.rgb[2]
        : 0;
      if (
        !previous ||
        score > previous.score ||
        (score === previous.score &&
          (minimum > previous.minimum ||
            (minimum === previous.minimum &&
              (deviation < previous.deviation ||
                (deviation === previous.deviation && value < previousValue)))))
      ) {
        const rgb: RGB = [r, g, b];
        const candidate: CategoryCandidate = {
          category: COLOR_CATEGORIES[categoryIndex].id,
          rgb,
          hex: toHex(rgb),
          score,
          mean,
          deviation,
          minimum,
        };
        best[categoryIndex] = candidate;
      }
    }
    if ((value & 8191) === 0 && performance.now() - lastProgress >= 100) {
      progress?.(value - start + 1, end - start);
      lastProgress = performance.now();
    }
  }

  progress?.(end - start, end - start);
  // Restricted test/partition ranges may omit categories; full search has all 12.
  const winners: CategoryCandidate[] = [];
  for (const candidate of best) if (candidate) winners.push(candidate);
  return winners;
}

export default searchColors;
