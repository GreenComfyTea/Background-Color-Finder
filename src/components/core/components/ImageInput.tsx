import { memo, useCallback, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Upload04Icon, Link01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

type Props = {
  loading: boolean;
  onLoad: (source: File | string) => void;
};

const ImageInput = memo<Props>(({ loading, onLoad }) => {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [url, setUrl] = useState<string>("");

  const openPicker = useCallback(() => fileRef.current?.click(), []);

  const changeFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        onLoad(file);
      }

      event.target.value = "";
    },
    [onLoad],
  );

  const changeUrl = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  }, []);

  const submitUrl = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (url.trim()) {
        onLoad(url);
      }
    },
    [onLoad, url],
  );

  return (
    <Card size="sm" className="shrink-0">
      <CardHeader>
        <CardTitle>Image source</CardTitle>
        <CardDescription>Choose, drop, or paste an image.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          tabIndex={-1}
          aria-label="Choose image file"
          className="sr-only"
          onChange={changeFile}
        />
        <Button
          variant="outline"
          disabled={loading}
          className="h-20 w-full flex-col gap-2 border-dashed"
          onClick={openPicker}
        >
          <HugeiconsIcon icon={Upload04Icon} data-icon="inline-start" />
          Choose an image
        </Button>
        <form onSubmit={submitUrl}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="image-url">Image URL / data URL</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <HugeiconsIcon icon={Link01Icon} />
                </InputGroupAddon>
                <InputGroupInput
                  id="image-url"
                  value={url}
                  placeholder="https://example.com/image.png"
                  autoComplete="off"
                  onChange={changeUrl}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="submit"
                    disabled={!url.trim() || loading}
                  >
                    Load
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">up to 16 MP / 50 MB</p>
      </CardFooter>
    </Card>
  );
});

export default ImageInput;
