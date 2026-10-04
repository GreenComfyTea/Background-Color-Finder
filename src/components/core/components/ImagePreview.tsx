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
  matte: string;
};

const ImagePreview = memo<Props>(({ image, background, matte }) => {
  const style = useMemo<CSSProperties>(
    () => ({ backgroundColor: background }),
    [background],
  );
  const imageStyle = useMemo<CSSProperties>(
    () => ({ backgroundColor: matte }),
    [matte],
  );
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Image preview</CardTitle>
        <CardDescription>
          {image ? image.name : "Your image, with a better backdrop."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1">
        {image && (
          <div
            style={style}
            className="flex min-h-72 w-full items-center justify-center rounded-xl p-8 transition-colors"
          >
            <img
              src={image.url}
              alt={`Preview of ${image.name}`}
              className="max-h-96 max-w-full rounded-sm object-contain shadow-lg"
              style={imageStyle}
            />
          </div>
        )}
        {!image && (
          <Empty className="min-h-72 w-full border border-dashed">
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
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          {image
            ? `${image.width.toLocaleString()}x${image.height.toLocaleString()} · native-resolution analysis · backdrop ${background}`
            : "PNG, JPEG, WebP, GIF, AVIF and other browser-supported images"}
        </p>
      </CardFooter>
    </Card>
  );
});

export default ImagePreview;
