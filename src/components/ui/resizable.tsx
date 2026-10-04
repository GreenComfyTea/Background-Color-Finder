"use client";

import { cn } from "cn";
import { memo } from "react";
import type {
  GroupProps as ResizableGroupProps,
  SeparatorProps as ResizableSeparatorProps,
  PanelProps as ResizablePrimitivePanelProps,
} from "react-resizable-panels";
import {
  Group as ResizableGroupPrimitive,
  Panel as ResizablePanelPrimitive,
  Separator as ResizableSeparatorPrimitive,
} from "react-resizable-panels";

const ResizablePanelGroup = memo<ResizableGroupProps>(
  ({ className, ...props }) => {
    return (
      <ResizableGroupPrimitive
        data-slot="resizable-panel-group"
        className={cn(
          "flex h-full w-full aria-[orientation=vertical]:flex-col",
          className,
        )}
        {...props}
      />
    );
  },
);

const ResizablePanel = memo<ResizablePrimitivePanelProps>(({ ...props }) => {
  return <ResizablePanelPrimitive data-slot="resizable-panel" {...props} />;
});

const ResizableHandle = memo<
  ResizableSeparatorProps & {
    withHandle?: boolean;
  }
>(({ withHandle, className, ...props }) => {
  return (
    <ResizableSeparatorPrimitive
      data-slot="resizable-handle"
      className={cn(
        "relative flex w-px items-center justify-center bg-border ring-offset-background after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90",
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-6 w-1 shrink-0 rounded-lg bg-border" />
      )}
    </ResizableSeparatorPrimitive>
  );
});

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
