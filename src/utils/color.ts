import type { OKLab, RGB, Candidate } from "@/types/types";

function linearize(channel: number): number {
  const value = channel / 255;

  if (value <= 0.04045) {
    return value / 12.92;
  }

  return ((value + 0.055) / 1.055) ** 2.4;
}

function linearToOKLab(r: number, g: number, b: number): OKLab {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function toOKLab(rgb: RGB): OKLab {
  return linearToOKLab(linearize(rgb[0]), linearize(rgb[1]), linearize(rgb[2]));
}

function toHex(rgb: RGB): string {
  return `#${((rgb[0] << 16) | (rgb[1] << 8) | rgb[2]).toString(16).padStart(6, "0").toUpperCase()}`;
}

function fromHex(hex: string): RGB {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) {
    throw new Error("Enter a six-digit HEX color, such as #FFFFFF.");
  }

  const value = Number.parseInt(hex.slice(1), 16);

  return [value >> 16, (value >> 8) & 255, value & 255];
}

function distanceSquared(a: OKLab, b: OKLab): number {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
}

function scoreColor(rgb: RGB, palette: readonly OKLab[]): Candidate {
  if (!palette.length) {
    throw new Error("Cannot score an empty palette.");
  }

  const lab = toOKLab(rgb);

  let mean = 0;
  let m2 = 0;
  let minimum = Infinity;

  for (let i = 0; i < palette.length; i++) {
    const distance = Math.sqrt(distanceSquared(lab, palette[i]));
    const delta = distance - mean;

    mean += delta / (i + 1);
    m2 += delta * (distance - mean);
    minimum = Math.min(minimum, distance);
  }

  const deviation = Math.sqrt(Math.max(0, m2 / palette.length));

  return {
    rgb,
    hex: toHex(rgb),
    score: minimum * Math.max(0, mean - deviation),
    mean,
    deviation,
    minimum,
  };
}

function compareCandidates(a: Candidate, b: Candidate): number {
  return (
    b.score - a.score ||
    b.minimum - a.minimum ||
    a.deviation - b.deviation ||
    a.rgb[0] - b.rgb[0] ||
    a.rgb[1] - b.rgb[1] ||
    a.rgb[2] - b.rgb[2]
  );
}

export {
  linearize,
  linearToOKLab,
  toOKLab,
  toHex,
  fromHex,
  distanceSquared,
  scoreColor,
  compareCandidates,
};
