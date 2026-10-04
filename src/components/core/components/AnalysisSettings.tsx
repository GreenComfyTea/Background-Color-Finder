import { memo, useCallback } from "react";
import type { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import Input from "@/components/ui/input";

type Props = {
  matte: string;
  onMatte: (value: string) => void;
  onAnalyze: () => void;
  onCancel: () => void;
  busy: boolean;
  hasImage: boolean;
};

const AnalysisSettings = memo<Props>(
  ({ matte, onMatte, onAnalyze, onCancel, busy, hasImage }) => {
    const changeMatte = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        onMatte(event.target.value.toUpperCase());
      },
      [onMatte],
    );

    return (
      <Card>
        <CardHeader>
          <CardTitle>The search parameters</CardTitle>
          <CardDescription>
            Every pixel. Every RGB color. No shortcuts.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="matte">Transparency background</FieldLabel>
              <div className="flex items-center gap-3">
                <Input
                  id="matte"
                  type="color"
                  value={matte}
                  disabled={busy}
                  className="h-10 w-16"
                  onChange={changeMatte}
                />
                <span className="font-mono text-sm">{matte}</span>
              </div>
              <FieldDescription>
                Partial transparency is composited onto this color. Fully
                transparent pixels are excluded.
              </FieldDescription>
            </Field>
          </FieldGroup>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <dt className="text-muted-foreground">Palette coverage</dt>
            <dd className="text-right">100% of visible pixels</dd>
            <dt className="text-muted-foreground">Adaptive palette</dt>
            <dd className="text-right">1–64 colors</dd>
            <dt className="text-muted-foreground">RMS error target</dt>
            <dd className="text-right">≤ 0.0200 OKLab</dd>
            <dt className="text-muted-foreground">Candidate colors</dt>
            <dd className="text-right">16,777,216</dd>
          </dl>
        </CardContent>
        <CardFooter>
          {busy && (
            <Button variant="outline" className="w-full" onClick={onCancel}>
              Cancel analysis
            </Button>
          )}
          {!busy && (
            <Button disabled={!hasImage} className="w-full" onClick={onAnalyze}>
              Find the best colors
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  },
);

export default AnalysisSettings;
