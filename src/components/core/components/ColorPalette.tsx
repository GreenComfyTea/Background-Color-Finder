import { memo, useCallback } from "react";
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
import PaletteSwatch from "./PaletteSwatch";
import type { Palette, PaletteColor } from "@/types/types";

type Props = { palette: Palette | null };

const ColorPalette = memo<Props>(({ palette }) => {
  const renderColor = useCallback(
    (color: PaletteColor, index: number) => (
      <PaletteSwatch
        key={color.hex}
        color={color}
        total={palette?.pixels ?? 1}
        rank={index + 1}
      />
    ),
    [palette?.pixels],
  );
  return (
    <Card
      size="sm"
      className="min-h-0 min-w-0 xl:h-full"
      aria-label="Image color palette"
    >
      <CardHeader className="shrink-0">
        <CardTitle>Color palette</CardTitle>
        <CardDescription>
          {palette
            ? `${palette.colors.length} groups · 100% coverage`
            : "Your image’s colors, ranked by coverage."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col">
        {palette ? (
          <ScrollArea
            className="h-96 min-h-0 xl:h-auto xl:flex-1"
            aria-label="Palette groups ranked by coverage"
            type="always"
          >
            <ol className="flex flex-col gap-3 pr-3">
              {palette.colors.map(renderColor)}
            </ol>
            {!palette.targetMet && (
              <p className="mt-3 pr-3 text-xs text-muted-foreground">
                64-color limit reached. All visible pixels are still
                represented.
              </p>
            )}
          </ScrollArea>
        ) : (
          <Empty className="min-h-48 border border-dashed">
            <EmptyHeader>
              <EmptyTitle>No palette yet</EmptyTitle>
              <EmptyDescription>
                Analyze an image to explore its color groups.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  );
});

export default ColorPalette;
