import { memo, useCallback, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CategoryCandidate } from "@/types/types";
import { COLOR_CATEGORIES } from "@/constants/constants";

type Props = {
  candidate: CategoryCandidate;
  selected: boolean;
  onSelect: (hex: string) => void;
};

const ResultCard = memo<Props>(({ candidate, selected, onSelect }) => {
  const [copyStatus, setCopyStatus] = useState("");
  const categoryLabel = useMemo(
    () =>
      COLOR_CATEGORIES.find((category) => category.id === candidate.category)
        ?.label ?? candidate.category,
    [candidate.category],
  );
  const style = useMemo<CSSProperties>(
    () => ({ backgroundColor: candidate.hex }),
    [candidate.hex],
  );
  const select = useCallback(
    () => onSelect(candidate.hex),
    [candidate.hex, onSelect],
  );
  const copyHex = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(candidate.hex);
      setCopyStatus("HEX copied");
    } catch {
      setCopyStatus("Clipboard unavailable; select the HEX value to copy.");
    }
  }, [candidate.hex]);

  return (
    <Card
      size="sm"
      className="min-w-0 gap-2 py-2"
      data-category={candidate.category}
      data-selected={selected}
    >
      <CardHeader className="px-3">
        <CardTitle>
          <span className="text-xs">{categoryLabel}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3">
        <Button
          variant="outline"
          className="h-10 w-full rounded-lg"
          style={style}
          aria-label={`Preview ${categoryLabel} backdrop ${candidate.hex}`}
          aria-pressed={selected}
          title={selected ? "Currently previewing" : "Preview backdrop"}
          onClick={select}
        >
          <span className="sr-only">
            {selected ? "Previewing" : "Preview backdrop"}
          </span>
        </Button>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-1 px-3">
        <div className="flex min-w-0 items-center justify-between gap-1">
          <span className="font-mono text-xs">{candidate.hex}</span>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={copyHex}
            aria-label={`Copy HEX ${candidate.hex}`}
            title="Copy HEX"
          >
            <HugeiconsIcon icon={Copy01Icon} />
          </Button>
        </div>
        {candidate.sourceMinimum === 0 && (
          <span className="text-xs text-destructive">Source color match</span>
        )}
        <span role="status" className="sr-only">
          {copyStatus}
        </span>
      </CardFooter>
    </Card>
  );
});

export default ResultCard;
