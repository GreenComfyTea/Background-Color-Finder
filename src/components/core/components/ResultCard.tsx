import { memo, useCallback, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Candidate } from "@/types/types";

type Props = {
  candidate: Candidate;
  rank: number;
  selected: boolean;
  onSelect: (hex: string) => void;
};

const ResultCard = memo<Props>(({ candidate, rank, selected, onSelect }) => {
  const [copyStatus, setCopyStatus] = useState<string>("");

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
      setCopyStatus("Clipboard unavailable; select the value to copy.");
    }
  }, [candidate.hex]);

  const copyRgb = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`rgb(${candidate.rgb.join(", ")})`);
      setCopyStatus("RGB copied");
    } catch {
      setCopyStatus("Clipboard unavailable; select the value to copy.");
    }
  }, [candidate.rgb]);

  return (
    <Card size="sm" className="min-w-0">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <Badge variant={rank === 1 ? "default" : "secondary"}>#{rank}</Badge>
          <span className="text-xs text-muted-foreground">
            {selected ? "Previewing" : "Best match"}
          </span>
        </div>
        <CardTitle>
          <span className="font-mono">{candidate.hex}</span>
        </CardTitle>
        <CardDescription>RGB {candidate.rgb.join(" · ")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div
          role="img"
          style={style}
          aria-label={`Recommended color ${candidate.hex}`}
          className="h-24 rounded-lg border"
        />
        <dl className="grid grid-cols-2 gap-2 text-xs tabular-nums">
          <dt className="text-muted-foreground">Score</dt>
          <dd className="text-right font-semibold">
            {candidate.score.toFixed(5)}
          </dd>
          <dt className="text-muted-foreground">Mean distance</dt>
          <dd className="text-right">{candidate.mean.toFixed(5)}</dd>
          <dt className="text-muted-foreground">Deviation</dt>
          <dd className="text-right">{candidate.deviation.toFixed(5)}</dd>
          <dt className="text-muted-foreground">Min distance</dt>
          <dd className="text-right">{candidate.minimum.toFixed(5)}</dd>
        </dl>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2">
        <Button
          variant={selected ? "secondary" : "outline"}
          aria-pressed={selected}
          onClick={select}
        >
          Preview backdrop
        </Button>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={copyHex}
          >
            <HugeiconsIcon icon={Copy01Icon} data-icon="inline-start" />
            HEX
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={copyRgb}
          >
            RGB
          </Button>
        </div>
        <p role="status" className="min-h-4 text-xs text-muted-foreground">
          {copyStatus}
        </p>
      </CardFooter>
    </Card>
  );
});

export default ResultCard;
