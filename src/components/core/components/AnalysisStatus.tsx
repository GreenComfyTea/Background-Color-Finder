import { memo, useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Progress from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalysisState } from "@/types/types";
import { STATES } from "@/constants/constants";

const TITLES = {
  idle: "Ready",
  loading: "Loading image…",
  scanning: "Scanning every pixel…",
  grouping: "Building the adaptive palette…",
  searching: "Searching the complete RGB space…",
  verifying: "Verifying the 12 category winners against every source pixel…",
  complete: "Search complete",
  cancelled: "Analysis cancelled",
  error: "Analysis failed",
};

type Props = {
  state: AnalysisState;
};

const AnalysisStatus = memo<Props>(({ state }) => {
  const running = useMemo<boolean>(
    () => STATES.includes(state.phase),
    [state.phase],
  );

  const progress = useMemo<number>(
    () => (state.total ? (state.processed / state.total) * 100 : 0),
    [state.processed, state.total],
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
    <Card size="sm" className="shrink-0" aria-label="Analysis progress">
      <CardHeader>
        <CardTitle role="status">{TITLES[state.phase]}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-xs tabular-nums text-muted-foreground">
          {state.phase === "complete"
            ? `${(state.elapsed / 1000).toFixed(1)}s · all RGB colors evaluated and source-verified`
            : state.total
              ? `${state.processed.toLocaleString()} / ${state.total.toLocaleString()} (${progress.toFixed(1)}%)`
              : ""}
        </p>
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
        {state.phase === "verifying" && (
          <p className="text-xs text-muted-foreground">
            The RGB search is complete. Checking actual nearest-source distances
            without changing the ranking; you can still cancel.
          </p>
        )}
      </CardContent>
    </Card>
  );
});

export default AnalysisStatus;
