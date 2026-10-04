"use client";

import { cn } from "cn";
import { Dialog as DialogPrimitive } from "radix-ui";

import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";

import { Button } from "./button";
import type { ComponentProps } from "react";
import { memo } from "react";

const Dialog = memo<ComponentProps<typeof DialogPrimitive.Root>>(
  ({ ...props }) => {
    return <DialogPrimitive.Root data-slot="dialog" {...props} />;
  },
);

const DialogTrigger = memo<ComponentProps<typeof DialogPrimitive.Trigger>>(
  ({ ...props }) => {
    return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
  },
);

const DialogPortal = memo<ComponentProps<typeof DialogPrimitive.Portal>>(
  ({ ...props }) => {
    return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
  },
);

const DialogClose = memo<ComponentProps<typeof DialogPrimitive.Close>>(
  ({ ...props }) => {
    return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
  },
);

const DialogOverlay = memo<ComponentProps<typeof DialogPrimitive.Overlay>>(
  ({ className, ...props }) => {
    return (
      <DialogPrimitive.Overlay
        data-slot="dialog-overlay"
        className={cn(
          "fixed inset-0 isolate z-50 bg-black/80 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
          className,
        )}
        {...props}
      />
    );
  },
);

const DialogContent = memo<
  ComponentProps<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean;
  }
>(({ className, children, showCloseButton = true, ...props }) => {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6 rounded-4xl bg-popover p-6 text-sm text-popover-foreground ring-1 ring-foreground/5 duration-100 outline-none sm:max-w-md data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close data-slot="dialog-close" asChild>
            <Button
              variant="ghost"
              className="absolute top-4 right-4"
              size="icon-sm"
            >
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              <span className="sr-only">Close</span>
            </Button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});

const DialogHeader = memo<ComponentProps<"div">>(({ className, ...props }) => {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
});

const DialogFooter = memo<
  ComponentProps<"div"> & {
    showCloseButton?: boolean;
  }
>(({ className, showCloseButton = false, children, ...props }) => {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  );
});

const DialogTitle = memo<ComponentProps<typeof DialogPrimitive.Title>>(
  ({ className, ...props }) => {
    return (
      <DialogPrimitive.Title
        data-slot="dialog-title"
        className={cn(
          "font-heading text-base leading-none font-medium",
          className,
        )}
        {...props}
      />
    );
  },
);

const DialogDescription = memo<
  ComponentProps<typeof DialogPrimitive.Description>
>(({ className, ...props }) => {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
});

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
