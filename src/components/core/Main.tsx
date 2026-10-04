import AnalysisSettings from "@/components/core/components/AnalysisSettings";
import AnalysisStatus from "@/components/core/components/AnalysisStatus";
import ColorPalette from "@/components/core/components/ColorPalette";
import ColorResults from "@/components/core/components/ColorResults";
import ImageInput from "@/components/core/components/ImageInput";
import ImagePreview from "@/components/core/components/ImagePreview";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { STATES } from "@/constants/constants";
import type {
  LoadedImage,
  AnalysisState,
  WorkerResponse,
  WorkerRequest,
} from "@/types/types";

import { fromHex } from "@/utils/color";
import { loadImage, readPixels } from "@/utils/image";

import { memo, useState, useRef, useCallback, useEffect } from "react";

const Main = memo(() => {
  const imageRef = useRef<LoadedImage | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const generation = useRef<number>(0);

  const [image, setImage] = useState<LoadedImage | null>(null);
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

        setSelected(message.candidates[0].hex);

        workerRef.current?.terminate();
        workerRef.current = null;
      } else {
        commit({ phase: "error", error: message.error });

        workerRef.current?.terminate();
        workerRef.current = null;
      }
    },
    [commit],
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

    return removePaste;
  }, [paste, removePaste]);

  const setupLifecycle = useCallback(() => dispose, [dispose]);

  useEffect(setupPaste, [setupPaste]);
  useEffect(setupLifecycle, [setupLifecycle]);

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-8 sm:py-12">
      <header className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <a href="#" className="text-sm font-semibold tracking-tight">
            BACKGROUND COLOR FINDER
          </a>
          <Badge variant="outline">On-device · OKLab</Badge>
        </div>
        <div className="max-w-3xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Find your counterpoint
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            The right color makes
            <br />
            your image stand apart.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Explore every RGB color to find the strongest, most consistent
            perceptual separation from your image.
          </p>
        </div>
      </header>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.3fr)]">
        <div className="flex flex-col gap-6">
          <ImageInput loading={state.phase === "loading"} onLoad={handleLoad} />
          <AnalysisSettings
            matte={matte}
            busy={busy}
            hasImage={Boolean(image)}
            onMatte={changeMatte}
            onAnalyze={analyze}
            onCancel={cancel}
          />
        </div>
        <ImagePreview image={image} background={selected} matte={matte} />
      </div>
      <AnalysisStatus state={state} />
      <ColorResults
        candidates={state.candidates}
        selected={selected}
        onSelect={selectColor}
      />
      {state.palette && <ColorPalette palette={state.palette} />}
      <Alert>
        <AlertTitle>
          Perceptual separation, not a readability guarantee
        </AlertTitle>
        <AlertDescription>
          Distances are Euclidean in OKLab, not WCAG contrast ratios. We favor a
          high average distance with low deviation, giving every palette color
          equal weight. All visible pixels are represented by up to 64 adaptive
          groups; a 0.02 RMS error target controls how faithfully those groups
          represent the image. Animated images use one decoded frame.
        </AlertDescription>
      </Alert>
      <footer className="text-xs text-muted-foreground">
        Your images stay in your browser. Remote image URLs contact their host
        directly and must allow CORS.
      </footer>
    </main>
  );
});

export default Main;
