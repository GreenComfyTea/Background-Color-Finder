import { memo, useMemo } from "react";
import type { CSSProperties } from "react";
import cn from "@/lib/utils";
import type { PaletteColor } from "@/types/types";

type Props = { color: PaletteColor; total: number; rank: number };

const PaletteSwatch = memo<Props>(({ color, total, rank }) => {
  const style = useMemo<CSSProperties>(
    () => ({ backgroundColor: color.hex }),
    [color.hex],
  );
  return (
    <li className="flex min-w-0 flex-col gap-1.5" data-rank={rank}>
      <div
        role="img"
        style={style}
        aria-label={`Palette color ${color.hex}, rank ${rank}`}
        className={cn(
          "rounded-lg border",
          rank <= 3 ? "h-16" : rank <= 8 ? "h-10" : "h-5",
        )}
      />
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="font-mono">{color.hex}</span>
        <span
          title={`${color.count.toLocaleString()} pixels`}
          className="tabular-nums text-muted-foreground"
        >
          {((color.count / total) * 100).toFixed(2)}%
        </span>
      </div>
    </li>
  );
});

export default PaletteSwatch;
