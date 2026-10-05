import { memo, useMemo } from "react";
import type { CSSProperties } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Image01Icon } from "@hugeicons/core-free-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { LoadedImage } from "@/types/types";

type Props = {
  image: LoadedImage | null;
  background: string;
};

const ImagePreview = memo<Props>(({ image, background }) => {
  const backdropStyle = useMemo<CSSProperties>(
    () => ({ backgroundColor: background }),
    [background],
  );
  const imageStyle = useMemo<CSSProperties>(
    () => ({
      // Fit both preview dimensions, including upscaling smaller images.
      width: image
        ? `min(100cqw, calc(100cqh * ${image.width / image.height}))`
        : undefined,
    }),
    [image],
  );
  return (
    <Card size="sm" className="min-h-0 min-w-0 xl:h-full">
      <CardHeader className="shrink-0">
        <CardTitle>Image preview</CardTitle>
        <CardDescription className="truncate" title={image?.name}>
          {image ? image.name : "Your image, with a better backdrop."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex h-[60svh] min-h-0 xl:h-auto xl:flex-1">
        {image && (
          <div
            className="flex size-full min-h-0 items-center justify-center overflow-hidden rounded-xl [container-type:size]"
            style={backdropStyle}
          >
            <img
              src={image.url}
              alt={`Preview of ${image.name}`}
              className="h-auto max-h-full max-w-full object-contain"
              style={imageStyle}
            />
          </div>
        )}
        {!image && (
          <Empty className="size-full min-h-0 border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HugeiconsIcon icon={Image01Icon} />
              </EmptyMedia>
              <EmptyTitle>A fresh perspective</EmptyTitle>
              <EmptyDescription>
                Add an image to discover the colors that stand apart from it.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
      <CardFooter className="shrink-0">
        <p className="text-xs text-muted-foreground">
          {image
            ? `${image.width.toLocaleString()} × ${image.height.toLocaleString()} · backdrop ${background}`
            : "PNG, JPEG, WebP, GIF, AVIF and other browser-supported images"}
        </p>
      </CardFooter>
    </Card>
  );
});

export default ImagePreview;
