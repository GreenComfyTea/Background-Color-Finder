import { memo, useCallback } from "react";
import type { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
      <Card size="sm" className="shrink-0">
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
                Used for partial transparency. Clear pixels are excluded.
              </FieldDescription>
            </Field>
          </FieldGroup>
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
