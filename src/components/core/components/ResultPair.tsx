import { memo, useCallback, useMemo } from "react";
import type { CategoryCandidate, ResultGroup } from "@/types/types";
import ResultCard from "./ResultCard";

type Props = {
  group: ResultGroup;
  candidates: readonly CategoryCandidate[];
  selected: string;
  onSelect: (hex: string) => void;
};

const ResultPair = memo<Props>(({ group, candidates, selected, onSelect }) => {
  const pair = useMemo<CategoryCandidate[]>(() => {
    const items: CategoryCandidate[] = [];
    for (const id of group.categories)
      for (const candidate of candidates)
        if (candidate.category === id) items.push(candidate);
    return items;
  }, [candidates, group]);
  const renderCandidate = useCallback(
    (candidate: CategoryCandidate) => (
      <ResultCard
        key={candidate.category}
        candidate={candidate}
        selected={selected === candidate.hex}
        onSelect={onSelect}
      />
    ),
    [onSelect, selected],
  );
  if (!pair.length) return null;
  return (
    <section
      className="flex min-w-0 flex-col gap-2"
      aria-label={`${group.label} recommendations`}
    >
      <h3 className="text-xs font-medium text-muted-foreground">
        {group.label}
      </h3>
      <div className="grid grid-cols-2 gap-2">{pair.map(renderCandidate)}</div>
    </section>
  );
});

export default ResultPair;
