import AnalysisSettings from "@/components/core/components/AnalysisSettings";
import AnalysisStatus from "@/components/core/components/AnalysisStatus";
import ColorPalette from "@/components/core/components/ColorPalette";
import ColorResults from "@/components/core/components/ColorResults";
import ImageInput from "@/components/core/components/ImageInput";
import ImagePreview from "@/components/core/components/ImagePreview";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { HugeiconsIcon } from "@hugeicons/react";
import { Upload04Icon } from "@hugeicons/core-free-icons";
import { STATES } from "@/constants/constants";
import type {
  LoadedImage,
  AnalysisState,
  WorkerResponse,
  WorkerRequest,
  CategoryCandidate,
} from "@/types/types";

import { compareCandidates, fromHex } from "@/utils/color";
import { loadImage, readPixels } from "@/utils/image";

import { memo, useState, useRef, useCallback, useEffect } from "react";

const Main = memo(() => {
  const imageRef = useRef<LoadedImage | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const generation = useRef<number>(0);

  const [image, setImage] = useState<LoadedImage | null>(null);
  const [draggingFile, setDraggingFile] = useState<boolean>(false);
  const [matte, setMatte] = useState<string>("#FFFFFF");
  const [selected, setSelected] = useState<string>("#FFFFFF");
  const [state, setState] = useState<AnalysisState>({
    phase: "idle",
    processed: 0,
    total: 0,
    palette: null,
    candidates: [],
    elapsed: 0,
    error: null,
  });

  const stateRef = useRef<AnalysisState>(state);
  const busy = STATES.includes(state.phase);

  const commit = useCallback((update: Partial<AnalysisState>) => {
    const next = { ...stateRef.current, ...update };

    stateRef.current = next;
    setState(next);
  }, []);

  const stop = useCallback(() => {
    generation.current++;

    workerRef.current?.terminate();
    workerRef.current = null;

    controllerRef.current?.abort();
    controllerRef.current = null;
  }, []);

  const cancel = useCallback(() => {
    stop();

    commit({ phase: "cancelled", error: null, candidates: [] });
  }, [commit, stop]);

  const selectColor = useCallback((hex: string) => setSelected(hex), []);
  const previewBest = useCallback(
    (candidates: readonly CategoryCandidate[]) => {
      let best = candidates[0];
      for (const candidate of candidates)
        if (!best || compareCandidates(candidate, best) < 0) best = candidate;
      if (best) setSelected(best.hex);
    },
    [],
  );

  const changeMatte = useCallback(
    (hex: string) => {
      stop();

      setMatte(hex);
      setSelected(hex);

      commit({
        phase: "idle",
        palette: null,
        candidates: [],
        error: null,
        processed: 0,
        total: 0,
      });
    },
    [commit, stop],
  );

  const handleLoad = useCallback(
    async (source: File | string) => {
      stop();

      const id = generation.current;
      const controller = new AbortController();
      controllerRef.current = controller;

      commit({
        phase: "loading",
        palette: null,
        candidates: [],
        error: null,
        processed: 0,
        total: 0,
      });

      try {
        const loaded = await loadImage(source, controller.signal);

        if (id !== generation.current) {
          URL.revokeObjectURL(loaded.url);
          return;
        }

        if (imageRef.current) {
          URL.revokeObjectURL(imageRef.current.url);
        }

        imageRef.current = loaded;

        setImage(loaded);
        setSelected(matte);

        commit({
          phase: "idle",
        });
      } catch (error) {
        if (id !== generation.current) {
          return;
        }

        commit({
          phase: "error",
          error:
            error instanceof Error ? error.message : "Could not load image.",
        });
      } finally {
        if (id === generation.current) {
          controllerRef.current = null;
        }
      }
    },
    [commit, matte, stop],
  );

  const receive = useCallback(
    (event: MessageEvent<WorkerResponse>) => {
      if (event.currentTarget !== workerRef.current) {
        return;
      }

      const message = event.data;
      if (message.type === "progress") {
        commit({
          phase: message.phase,
          processed: message.processed,
          total: message.total,
        });
      } else if (message.type === "palette") {
        commit({ palette: message.palette });
      } else if (message.type === "complete") {
        commit({
          phase: "complete",
          candidates: message.candidates,
          elapsed: message.elapsed,
          processed: 256 ** 3,
          total: 256 ** 3,
        });

        previewBest(message.candidates);

        workerRef.current?.terminate();
        workerRef.current = null;
      } else {
        commit({ phase: "error", error: message.error });

        workerRef.current?.terminate();
        workerRef.current = null;
      }
    },
    [commit, previewBest],
  );
  const workerError = useCallback(
    (event: ErrorEvent) => {
      if (event.currentTarget !== workerRef.current) return;

      commit({
        phase: "error",
        error:
          "The analysis worker could not run. Please retry or use a smaller image.",
      });

      workerRef.current?.terminate();
      workerRef.current = null;
    },
    [commit],
  );

  const analyze = useCallback(async () => {
    const currentImage = imageRef.current;
    if (!currentImage) return;

    stop();

    const id = generation.current;

    commit({
      phase: "scanning",
      palette: null,
      candidates: [],
      error: null,
      processed: 0,
      total: currentImage.width * currentImage.height,
    });

    try {
      const pixels = await readPixels(currentImage);

      if (id !== generation.current) {
        return;
      }

      const worker = new Worker(
        new URL("../../utils/analysis.worker.ts", import.meta.url),
        { type: "module" },
      );

      workerRef.current = worker;
      worker.onmessage = receive;
      worker.onerror = workerError;

      const request: WorkerRequest = {
        pixels,
        background: fromHex(matte),
      };

      worker.postMessage(request, [pixels]);
    } catch (error) {
      if (id !== generation.current) {
        return;
      }

      workerRef.current?.terminate();
      workerRef.current = null;

      commit({
        phase: "error",
        error:
          error instanceof Error ? error.message : "Could not analyze image.",
      });
    }
  }, [commit, matte, receive, stop, workerError]);

  const paste = useCallback(
    (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;

      if (items) {
        for (const item of items) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (file) {
              event.preventDefault();
              void handleLoad(file);
              return;
            }
          }
        }
      }

      const target = event.target;

      if (
        target instanceof HTMLElement &&
        (target.closest("input, textarea") || target.isContentEditable)
      ) {
        return;
      }

      const text = event.clipboardData?.getData("text/plain").trim();

      if (text && (/^https?:\/\//i.test(text) || /^data:image\//i.test(text))) {
        event.preventDefault();
        void handleLoad(text);
      }
    },
    [handleLoad],
  );

  const dispose = useCallback(() => {
    stop();

    if (imageRef.current) {
      URL.revokeObjectURL(imageRef.current.url);
    }

    imageRef.current = null;
  }, [stop]);

  const removePaste = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.removeEventListener("paste", paste);
  }, [paste]);

  const setupPaste = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.addEventListener("paste", paste);
    return removePaste;
  }, [paste, removePaste]);

  const setupLifecycle = useCallback(() => dispose, [dispose]);

  const setupFileDrop = useCallback(() => {
    let dragDepth = 0;
    let dragTimeout: ReturnType<typeof setTimeout> | undefined;

    // Files are not readable until drop; the type list is available during drag.
    const hasFiles = (event: DragEvent) =>
      event.dataTransfer?.types.includes("Files") ?? false;

    const resetDrag = () => {
      clearTimeout(dragTimeout);
      dragDepth = 0;
      setDraggingFile(false);
    };

    const showDrag = () => {
      setDraggingFile(true);
      clearTimeout(dragTimeout);
      // External drags may be cancelled without sending dragend to this page.
      dragTimeout = setTimeout(resetDrag, 1500);
    };

    const enter = (event: DragEvent) => {
      if (!hasFiles(event)) return;

      event.preventDefault();
      dragDepth++;
      showDrag();
    };

    const over = (event: DragEvent) => {
      if (!hasFiles(event)) return;

      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
      showDrag();
    };

    const leave = (event: DragEvent) => {
      if (!hasFiles(event)) return;

      dragDepth = Math.max(0, dragDepth - 1);
      if (dragDepth === 0) resetDrag();
    };

    const drop = (event: DragEvent) => {
      resetDrag();
      if (!hasFiles(event)) return;

      event.preventDefault();
      const file = event.dataTransfer?.files[0];
      if (file) void handleLoad(file);
    };

    const keyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") resetDrag();
    };

    window.addEventListener("dragenter", enter, true);
    window.addEventListener("dragover", over, true);
    window.addEventListener("dragleave", leave, true);
    window.addEventListener("drop", drop, true);
    window.addEventListener("dragend", resetDrag);
    window.addEventListener("blur", resetDrag);
    window.addEventListener("keydown", keyDown);

    return () => {
      clearTimeout(dragTimeout);
      window.removeEventListener("dragenter", enter, true);
      window.removeEventListener("dragover", over, true);
      window.removeEventListener("dragleave", leave, true);
      window.removeEventListener("drop", drop, true);
      window.removeEventListener("dragend", resetDrag);
      window.removeEventListener("blur", resetDrag);
      window.removeEventListener("keydown", keyDown);
    };
  }, [handleLoad]);

  useEffect(setupPaste, [setupPaste]);
  useEffect(setupFileDrop, [setupFileDrop]);
  useEffect(setupLifecycle, [setupLifecycle]);

  return (
    <main className="flex min-h-svh w-full flex-col gap-4 p-4 xl:h-dvh xl:min-h-0 xl:overflow-hidden xl:p-5">
      {draggingFile && (
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center bg-background/80 p-6 backdrop-blur-sm">
          <Alert role="status" className="max-w-md border-dashed">
            <HugeiconsIcon icon={Upload04Icon} />
            <AlertTitle>Drop an image to load it</AlertTitle>
            <AlertDescription>
              Drop anywhere on this page. Only the first file is loaded. Choose
              Find the best colors to start analysis.
            </AlertDescription>
          </Alert>
        </div>
      )}
      <header className="flex shrink-0 flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <a href="#" className="text-lg font-semibold tracking-tight">
            BACKGROUND COLOR FINDER
          </a>
        </div>
      </header>
      <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.75fr)_minmax(0,1.75fr)_minmax(0,1fr)]">
        <div
          className="flex min-h-0 min-w-0 flex-col gap-4 xl:overflow-y-auto xl:overscroll-contain xl:p-px"
          aria-label="Image and analysis controls"
        >
          <ImageInput loading={state.phase === "loading"} onLoad={handleLoad} />
          <AnalysisSettings
            matte={matte}
            busy={busy}
            hasImage={Boolean(image)}
            onMatte={changeMatte}
            onAnalyze={analyze}
            onCancel={cancel}
          />
          <AnalysisStatus state={state} />
        </div>
        <ImagePreview image={image} background={selected} />
        <ColorResults
          candidates={state.candidates}
          selected={selected}
          onSelect={selectColor}
        />
        <ColorPalette palette={state.palette} />
      </div>
    </main>
  );
});

export default Main;
