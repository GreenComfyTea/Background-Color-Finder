import { memo, useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Progress from "@/components/ui/progress";
import type { AnalysisState } from "@/types/types";
import { STATES } from "@/constants/constants";

const TITLES = {
  idle: "Ready",
  loading: "Loading image…",
  scanning: "Scanning every pixel…",
  grouping: "Building the adaptive palette…",
  searching: "Searching the complete RGB space…",
  complete: "Search complete",
  cancelled: "Analysis cancelled",
  error: "Analysis failed",
};

type Props = {
  state: AnalysisState;
};

const AnalysisStatus = memo<Props>(({ state }) => {
  const running = useMemo(() => STATES.includes(state.phase), []);

  const progress = useMemo(
    () => (state.total ? (state.processed / state.total) * 100 : 0),
    [],
  );

  if (state.phase === "idle") {
    return null;
  }

  if (state.error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Unable to analyze image</AlertTitle>
        <AlertDescription>{state.error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <section
      className="flex flex-col gap-3 rounded-xl border bg-card p-5"
      aria-label="Analysis progress"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p role="status" className="text-sm font-medium">
          {TITLES[state.phase]}
        </p>
        <p className="text-xs tabular-nums text-muted-foreground">
          {state.phase === "complete"
            ? `${(state.elapsed / 1000).toFixed(1)} seconds · all 16,777,216 candidates evaluated`
            : state.total
              ? `${state.processed.toLocaleString()} / ${state.total.toLocaleString()} (${progress.toFixed(1)}%)`
              : ""}
        </p>
      </div>
      {running && (
        <Progress
          value={progress}
          aria-label={TITLES[state.phase]}
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      )}
      {state.phase === "searching" && (
        <p className="text-xs text-muted-foreground">
          Exact evaluation against every palette color. Larger palettes take
          longer; you can cancel at any time.
        </p>
      )}
    </section>
  );
});

export default AnalysisStatus;
