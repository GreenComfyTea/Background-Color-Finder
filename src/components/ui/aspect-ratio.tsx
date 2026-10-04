"use client";

import { AspectRatio as AspectRatioPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { memo } from "react";

const AspectRatio = memo<ComponentProps<typeof AspectRatioPrimitive.Root>>(
  ({ ...props }) => {
    return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
  },
);

export default AspectRatio;
