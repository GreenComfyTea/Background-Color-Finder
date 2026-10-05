export type RGB = readonly [number, number, number];
export type OKLab = readonly [number, number, number];
export type ColorFamily =
  "overall" | "grayscale" | "red" | "green" | "blue" | "yellow";
export type ColorTone = "dark" | "light";
export type CategoryId = `${ColorFamily}-${ColorTone}`;
export type ColorCategory = {
  id: CategoryId;
  family: ColorFamily;
  tone: ColorTone;
  label: string;
};
export type CategoryCandidate = Candidate & { category: CategoryId };
export type ResultGroup = {
  family: ColorFamily;
  label: string;
  categories: readonly [CategoryId, CategoryId];
};

export type PaletteColor = {
  rgb: RGB;
  lab: OKLab;
  hex: string;
  count: number;
};

export type Palette = {
  colors: PaletteColor[];
  pixels: number;
  skipped: number;
  uniqueColors: number;
  error: number;
  maxError: number;
  rmsTarget: number;
  maxTarget: number;
  rmsTargetMet: boolean;
  maxTargetMet: boolean;
  targetMet: boolean;
};

export type Candidate = {
  rgb: RGB;
  hex: string;
  score: number;
  mean: number;
  deviation: number;
  minimum: number;
  sourceMinimum?: number;
  nearestSourceHex?: string;
};

export type LoadedImage = {
  url: string;
  name: string;
  width: number;
  height: number;
  blob: Blob;
};

export type Phase =
  | "idle"
  | "loading"
  | "scanning"
  | "grouping"
  | "searching"
  | "verifying"
  | "complete"
  | "cancelled"
  | "error";

export type AnalysisState = {
  phase: Phase;
  processed: number;
  total: number;
  palette: Palette | null;
  candidates: CategoryCandidate[];
  elapsed: number;
  error: string | null;
};

export type WorkerRequest = {
  pixels: ArrayBuffer;
  background: RGB;
};

export type WorkerResponse =
  | {
      type: "progress";
      phase: "scanning" | "grouping" | "searching" | "verifying";
      processed: number;
      total: number;
    }
  | { type: "palette"; palette: Palette }
  | { type: "complete"; candidates: CategoryCandidate[]; elapsed: number }
  | { type: "error"; error: string };

export type PaletteProgress = (
  phase: "scanning" | "grouping",
  processed: number,
  total: number,
) => void;

export type SearchProgress = (processed: number, total: number) => void;
