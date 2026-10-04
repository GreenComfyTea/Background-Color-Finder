import { memo, useCallback } from "react";
import ResultCard from "./ResultCard";
import type { Candidate } from "@/types/types";

type Props = {
  candidates: Candidate[];
  selected: string;
  onSelect: (hex: string) => void;
};

const ColorResults = memo<Props>(({ candidates, selected, onSelect }) => {
  const renderCandidate = useCallback(
    (candidate: Candidate, index: number) => {
      return (
        <ResultCard
          key={candidate.hex}
          candidate={candidate}
          rank={index + 1}
          selected={selected === candidate.hex}
          onSelect={onSelect}
        />
      );
    },
    [onSelect, selected],
  );

  if (!candidates.length) {
    return null;
  }

  return (
    <section className="flex flex-col gap-5" aria-labelledby="results-title">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-primary">
          The results
        </p>
        <h2
          id="results-title"
          className="text-2xl font-semibold tracking-tight"
        >
          Five colors that stand apart
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Ranked by mean OKLab distance minus standard deviation. Exact winners
          may look similar—no artificial diversity filter is applied.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {candidates.map(renderCandidate)}
      </div>
    </section>
  );
});

export default ColorResults;
