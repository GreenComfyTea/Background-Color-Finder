import { memo, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PaletteSwatch from "./PaletteSwatch";
import type { Palette, PaletteColor } from "@/types/types";

type Props = {
  palette: Palette;
};

const ColorPalette = memo<Props>(({ palette }) => {
  const renderColor = useCallback(
    (color: PaletteColor) => {
      return (
        <PaletteSwatch key={color.hex} color={color} total={palette.pixels} />
      );
    },
    [palette.pixels],
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>The image palette</CardTitle>
          <Badge variant="secondary">
            {palette.colors.length} colors · 100% coverage
          </Badge>
        </div>
        <CardDescription>
          {palette.pixels.toLocaleString()} analyzed pixels ·{" "}
          {palette.uniqueColors.toLocaleString()} source colors ·{" "}
          {palette.skipped.toLocaleString()} transparent pixels excluded
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-12">
          {palette.colors.map(renderColor)}
        </ul>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2">
        <p className="text-sm">
          RMS representation error:{" "}
          <span className="font-mono">{palette.error.toFixed(4)}</span> ·{" "}
          {palette.targetMet
            ? "0.0200 target met"
            : "Target not met within the 64-color limit"}
        </p>
        <p className="text-xs text-muted-foreground">
          Every visible pixel belongs to a group; no rare colors are discarded.
          Percentages show pixel frequency, but each palette color has equal
          weight in the search.
        </p>
      </CardFooter>
    </Card>
  );
});

export default ColorPalette;
