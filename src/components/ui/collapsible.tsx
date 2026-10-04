"use client";

import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { memo } from "react";

const Collapsible = memo<ComponentProps<typeof CollapsiblePrimitive.Root>>(
  ({ ...props }) => {
    return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
  },
);

const CollapsibleTrigger = memo<
  ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>
>(({ ...props }) => {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  );
});

const CollapsibleContent = memo<
  ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>
>(({ ...props }) => {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  );
});

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
