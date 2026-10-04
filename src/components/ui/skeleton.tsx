import { cn } from "cn";
import type { ComponentProps } from "react";
import { memo } from "react";

const Skeleton = memo<ComponentProps<"div">>(({ className, ...props }) => {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-xl bg-muted", className)}
      {...props}
    />
  );
});

export default Skeleton;
