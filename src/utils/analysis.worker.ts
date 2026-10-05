import type { WorkerResponse, WorkerRequest } from "@/types/types";
import createPalette from "./palette";
import searchColors from "@/utils/search";
import verifyCandidates from "./verifyCandidates";

function send(message: WorkerResponse): void {
  self.postMessage(message);
}

function paletteProgress(
  phase: "scanning" | "grouping",
  processed: number,
  total: number,
): void {
  send({ type: "progress", phase, processed, total });
}

function searchProgress(processed: number, total: number): void {
  send({ type: "progress", phase: "searching", processed, total });
}

function verificationProgress(processed: number, total: number): void {
  send({ type: "progress", phase: "verifying", processed, total });
}

function handleMessage(event: MessageEvent<WorkerRequest>): void {
  const started = performance.now();

  try {
    const pixels = new Uint8ClampedArray(event.data.pixels);
    const palette = createPalette(
      pixels,
      event.data.background,
      paletteProgress,
    );

    send({ type: "palette", palette });
    searchProgress(0, 256 ** 3);

    const winners = searchColors(palette.colors, searchProgress);
    const candidates = verifyCandidates(
      winners,
      pixels,
      event.data.background,
      verificationProgress,
    );

    send({
      type: "complete",
      candidates,
      elapsed: performance.now() - started,
    });
  } catch (error) {
    send({
      type: "error",
      error: error instanceof Error ? error.message : "Image analysis failed.",
    });
  }
}

self.onmessage = handleMessage;
