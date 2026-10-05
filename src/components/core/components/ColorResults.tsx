import { memo, useCallback } from "react";
import ResultPair from "./ResultPair";
import type { CategoryCandidate, ResultGroup } from "@/types/types";
import { RESULT_GROUPS } from "@/constants/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

type Props = {
  candidates: CategoryCandidate[];
  selected: string;
  onSelect: (hex: string) => void;
};

const ColorResults = memo<Props>(({ candidates, selected, onSelect }) => {
  const renderGroup = useCallback(
    (group: ResultGroup) => {
      return (
        <ResultPair
          key={group.family}
          group={group}
          candidates={candidates}
          selected={selected}
          onSelect={onSelect}
        />
      );
    },
    [candidates, onSelect, selected],
  );

  return (
    <Card
      size="sm"
      className="min-h-0 min-w-0 xl:h-full"
      aria-labelledby="results-title"
    >
      <CardHeader className="shrink-0">
        <CardTitle id="results-title">Color matches</CardTitle>
        <CardDescription>
          Select a swatch to preview its backdrop.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col">
        {candidates.length > 0 ? (
          <ScrollArea
            className="min-h-0 flex-1 [&_[data-slot=scroll-area-viewport]]:h-auto xl:[&_[data-slot=scroll-area-viewport]]:h-full"
            aria-label="Matched backdrop colors"
            type="auto"
          >
            <div className="flex flex-col gap-4 p-px pr-3">
              {RESULT_GROUPS.map(renderGroup)}
            </div>
          </ScrollArea>
        ) : (
          <Empty className="min-h-48 border border-dashed">
            <EmptyHeader>
              <EmptyTitle>Find your backdrop</EmptyTitle>
              <EmptyDescription>
                Load an image and find the best colors to see your matches here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  );
});

export default ColorResults;
