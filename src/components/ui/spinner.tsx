import { cn } from "cn";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import type { ComponentProps } from "react";
import { memo } from "react";

const Spinner = memo<ComponentProps<"svg">>(
  ({ className, strokeWidth, ...props }) => {
    return (
      <HugeiconsIcon
        icon={Loading03Icon}
        strokeWidth={typeof strokeWidth === "number" ? strokeWidth : 2}
        data-slot="spinner"
        role="status"
        aria-label="Loading"
        className={cn("size-4 animate-spin", className)}
        {...props}
      />
    );
  },
);

export default Spinner;
