import type { PaletteColor } from "@/types/types";
import { memo, useMemo } from "react";
import type { CSSProperties } from "react";

type Props = {
  color: PaletteColor;
  total: number;
};

const PaletteSwatch = memo<Props>(({ color, total }) => {
  const style = useMemo<CSSProperties>(
    () => ({ backgroundColor: color.hex }),
    [color.hex],
  );
  return (
    <li className="flex min-w-0 flex-col gap-2">
      <div
        role="img"
        style={style}
        aria-label={`Palette color ${color.hex}`}
        className="h-14 rounded-lg border"
      />
      <span className="font-mono text-xs">{color.hex}</span>
      <span
        title={`${color.count.toLocaleString()} pixels`}
        className="text-xs tabular-nums text-muted-foreground"
      >
        {((color.count / total) * 100).toFixed(2)}%
      </span>
    </li>
  );
});

export default PaletteSwatch;
