import {
  MAX_PALETTE_COLORS,
  ERROR_TARGET,
  MAX_UNIQUE_COLORS,
} from "@/constants/constants";
import type {
  RGB,
  OKLab,
  PaletteColor,
  PaletteProgress,
  Palette,
} from "@/types/types";
import { distanceSquared, toHex, toOKLab } from "./color";

type Entry = { rgb: RGB; lab: OKLab; count: number; key: number };

type Group = {
  entries: Entry[];
  color: PaletteColor;
  error: number;
  axis: number;
};

function describeGroup(entries: Entry[]): Group {
  let count = 0;

  const rgbSum = [0, 0, 0];
  const labSum = [0, 0, 0];

  for (const entry of entries) {
    count += entry.count;

    for (let axis = 0; axis < 3; axis++) {
      rgbSum[axis] += entry.rgb[axis] * entry.count;
      labSum[axis] += entry.lab[axis] * entry.count;
    }
  }
  const rgb: RGB = [
    Math.round(rgbSum[0] / count),
    Math.round(rgbSum[1] / count),
    Math.round(rgbSum[2] / count),
  ];

  const lab = toOKLab(rgb);
  const variance = [0, 0, 0];

  let error = 0;

  for (const entry of entries) {
    error += entry.count * distanceSquared(entry.lab, lab);

    for (let axis = 0; axis < 3; axis++) {
      variance[axis] +=
        entry.count * (entry.lab[axis] - labSum[axis] / count) ** 2;
    }
  }

  let axis = 0;

  if (variance[1] > variance[axis]) {
    axis = 1;
  }

  if (variance[2] > variance[axis]) {
    axis = 2;
  }

  return {
    entries,
    color: {
      rgb,
      lab,
      hex: toHex(rgb),
      count,
    },
    error,
    axis,
  };
}

function createPalette(
  pixels: Uint8ClampedArray,
  background: RGB,
  progress?: PaletteProgress,
  maxColors = MAX_PALETTE_COLORS,
  target = ERROR_TARGET,
): Palette {
  if (
    pixels.length % 4 !== 0 ||
    !Number.isInteger(maxColors) ||
    maxColors < 1 ||
    maxColors > 64 ||
    target < 0
  ) {
    throw new Error("Invalid palette settings.");
  }

  const histogram = new Map<number, number>();

  let skipped = 0;

  for (let offset = 0; offset < pixels.length; offset += 4) {
    const alpha = pixels[offset + 3] / 255;
    if (alpha === 0) {
      skipped++;
    } else {
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

    if ((offset & 262143) === 0) {
      progress?.("scanning", offset / 4, pixels.length / 4);
    }
  }
  const count = pixels.length / 4 - skipped;

  if (!count) {
    throw new Error(
      "This image is fully transparent and has no visible pixels to analyze.",
    );
  }

  const entries: Entry[] = [];

  for (const [key, frequency] of histogram) {
    const rgb: RGB = [key >> 16, (key >> 8) & 255, key & 255];

    entries.push({ rgb, lab: toOKLab(rgb), count: frequency, key });
  }

  const groups: Group[] = [describeGroup(entries)];

  let squaredError = groups[0].error;

  while (
    groups.length < maxColors &&
    Math.sqrt(squaredError / count) > target
  ) {
    let selected = -1;
    for (let i = 0; i < groups.length; i++) {
      if (
        groups[i].entries.length > 1 &&
        (selected < 0 || groups[i].error > groups[selected].error)
      ) {
        selected = i;
      }
    }

    if (selected < 0) {
      break;
    }

    const group = groups[selected];

    group.entries.sort(
      (a: Entry, b: Entry): number =>
        a.lab[group.axis] - b.lab[group.axis] || a.key - b.key,
    );

    let frequency = 0;
    let split = 1;

    for (let i = 0; i < group.entries.length - 1; i++) {
      frequency += group.entries[i].count;
      split = i + 1;

      if (frequency >= group.color.count / 2) {
        break;
      }
    }

    groups.splice(
      selected,
      1,
      describeGroup(group.entries.slice(0, split)),
      describeGroup(group.entries.slice(split)),
    );
    squaredError = 0;

    for (const item of groups) {
      squaredError += item.error;
    }

    progress?.("grouping", groups.length, maxColors);
  }
  const merged = new Map<string, PaletteColor>();
  for (const group of groups) {
    const previous = merged.get(group.color.hex);

    if (previous) {
      previous.count += group.color.count;
    } else {
      merged.set(group.color.hex, {
        ...group.color,
      });
    }
  }

  const colors = [...merged.values()];

  colors.sort(
    (a: PaletteColor, b: PaletteColor): number =>
      b.count - a.count || a.hex.localeCompare(b.hex),
  );

  const error = Math.sqrt(squaredError / count);

  return {
    colors,
    pixels: count,
    skipped,
    uniqueColors: histogram.size,
    error,
    targetMet: error <= target,
  };
}

export { createPalette, describeGroup, distanceSquared, toHex, toOKLab };
