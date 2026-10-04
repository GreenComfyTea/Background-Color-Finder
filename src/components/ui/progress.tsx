"use client";

import { cn } from "cn";
import { Progress as ProgressPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { memo } from "react";

const Progress = memo<ComponentProps<typeof ProgressPrimitive.Root>>(
  ({ className, value, ...props }) => {
    return (
      <ProgressPrimitive.Root
        data-slot="progress"
        className={cn(
          "relative flex h-3 w-full items-center overflow-x-hidden rounded-4xl bg-muted",
          className,
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="size-full flex-1 bg-primary transition-all"
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
    );
  },
);

export default Progress;
