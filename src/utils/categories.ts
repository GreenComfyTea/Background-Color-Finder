import {
  FAMILY_HUE_CENTERS,
  FAMILY_HUE_RADIUS,
  FAMILY_MIN_SATURATION,
  FAMILY_MIN_LIGHTNESS,
  FAMILY_MAX_LIGHTNESS,
  FAMILY_MIN_CHROMA,
  LIGHTNESS_SPLIT,
} from "@/constants/constants";
import type { OKLab } from "@/types/types";

// Tiny tolerance absorbs hue/saturation arithmetic roundoff at inclusive edges.
function isFamilyHue(hue: number, saturation: number, center: number): boolean {
  const normalized = ((hue % 360) + 360) % 360;
  const distance = Math.abs(normalized - center);
  return (
    saturation + 1e-12 >= FAMILY_MIN_SATURATION &&
    Math.min(distance, 360 - distance) <= FAMILY_HUE_RADIUS + 1e-12
  );
}

// Bitmask avoids per-candidate array allocations in the exhaustive search.
function getCategoryMask(r: number, g: number, b: number, lab: OKLab): number {
  const lightness = lab[0];
  const tone = lightness < LIGHTNESS_SPLIT ? 0 : 1;
  let mask = 1 << tone;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta === 0) return mask | (1 << (2 + tone));
  // Preserve full overall/grayscale ranges; perceptual limits apply only to
  // named families. Squared chroma avoids a square root for every RGB value.
  if (
    lightness < FAMILY_MIN_LIGHTNESS ||
    lightness > FAMILY_MAX_LIGHTNESS ||
    lab[1] * lab[1] + lab[2] * lab[2] < FAMILY_MIN_CHROMA * FAMILY_MIN_CHROMA
  )
    return mask;
  const saturation = delta / (255 - Math.abs(max + min - 255));
  if (saturation + 1e-12 < FAMILY_MIN_SATURATION) return mask;
  let hue: number;
  if (max === r) hue = 60 * (((g - b) / delta) % 6);
  else if (max === g) hue = 60 * ((b - r) / delta + 2);
  else hue = 60 * ((r - g) / delta + 4);
  if (hue < 0) hue += 360;
  for (let i = 0; i < FAMILY_HUE_CENTERS.length; i++) {
    const distance = Math.abs(hue - FAMILY_HUE_CENTERS[i]);
    if (Math.min(distance, 360 - distance) <= FAMILY_HUE_RADIUS + 1e-12)
      mask |= 1 << (4 + i * 2 + tone);
  }
  return mask;
}

export { getCategoryMask, isFamilyHue };
