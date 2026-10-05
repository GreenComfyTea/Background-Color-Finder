import type { ColorCategory, ResultGroup } from "@/types/types";

export const STATES = [
  "loading",
  "scanning",
  "grouping",
  "searching",
  "verifying",
];

export const MAX_UNIQUE_COLORS = 500_000;
export const MAX_PALETTE_COLORS = 64;
export const ERROR_TARGET = 0.02;
export const MAX_ERROR_TARGET = 0.05;
export const RGB_COUNT = 256 ** 3;

export const LIGHTNESS_SPLIT = 0.6;
export const FAMILY_HUE_RADIUS = 15;
export const FAMILY_MIN_SATURATION = 0.6;
export const FAMILY_MIN_LIGHTNESS = 0.4;
export const FAMILY_MAX_LIGHTNESS = 0.9;
export const FAMILY_MIN_CHROMA = 0.1;
export const FAMILY_HUE_CENTERS = [0, 120, 240, 60] as const;

// Array order matches category bits in getCategoryMask and fixed display order.
export const COLOR_CATEGORIES: readonly ColorCategory[] = [
  {
    id: "overall-dark",
    family: "overall",
    tone: "dark",
    label: "Best dark color",
  },
  {
    id: "overall-light",
    family: "overall",
    tone: "light",
    label: "Best light color",
  },
  {
    id: "grayscale-dark",
    family: "grayscale",
    tone: "dark",
    label: "Dark grayscale",
  },
  {
    id: "grayscale-light",
    family: "grayscale",
    tone: "light",
    label: "Light grayscale",
  },
  { id: "red-dark", family: "red", tone: "dark", label: "Dark red" },
  { id: "red-light", family: "red", tone: "light", label: "Light red" },
  { id: "green-dark", family: "green", tone: "dark", label: "Dark green" },
  { id: "green-light", family: "green", tone: "light", label: "Light green" },
  { id: "blue-dark", family: "blue", tone: "dark", label: "Dark blue" },
  { id: "blue-light", family: "blue", tone: "light", label: "Light blue" },
  { id: "yellow-dark", family: "yellow", tone: "dark", label: "Dark yellow" },
  {
    id: "yellow-light",
    family: "yellow",
    tone: "light",
    label: "Light yellow",
  },
];

export const RESULT_GROUPS: readonly ResultGroup[] = [
  {
    family: "overall",
    label: "Overall",
    categories: ["overall-dark", "overall-light"],
  },
  {
    family: "grayscale",
    label: "Grayscale",
    categories: ["grayscale-dark", "grayscale-light"],
  },
  { family: "red", label: "Red", categories: ["red-dark", "red-light"] },
  {
    family: "green",
    label: "Green",
    categories: ["green-dark", "green-light"],
  },
  { family: "blue", label: "Blue", categories: ["blue-dark", "blue-light"] },
  {
    family: "yellow",
    label: "Yellow",
    categories: ["yellow-dark", "yellow-light"],
  },
];
