export type RGB = readonly [number, number, number];
export type OKLab = readonly [number, number, number];

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
  targetMet: boolean;
};

export type Candidate = {
  rgb: RGB;
  hex: string;
  score: number;
  mean: number;
  deviation: number;
  minimum: number;
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
  | "complete"
  | "cancelled"
  | "error";

export type AnalysisState = {
  phase: Phase;
  processed: number;
  total: number;
  palette: Palette | null;
  candidates: Candidate[];
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
      phase: "scanning" | "grouping" | "searching";
      processed: number;
      total: number;
    }
  | { type: "palette"; palette: Palette }
  | { type: "complete"; candidates: Candidate[]; elapsed: number }
  | { type: "error"; error: string };

export type PaletteProgress = (
  phase: "scanning" | "grouping",
  processed: number,
  total: number,
) => void;

export type SearchProgress = (processed: number, total: number) => void;
