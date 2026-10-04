import { cn } from "cn";
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";

import { Button } from "./button";
import type { ComponentProps } from "react";
import { memo } from "react";

const AlertDialog = memo<ComponentProps<typeof AlertDialogPrimitive.Root>>(
  ({ ...props }) => {
    return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
  },
);

const AlertDialogTrigger = memo<
  ComponentProps<typeof AlertDialogPrimitive.Trigger>
>(({ ...props }) => {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  );
});

const AlertDialogPortal = memo<
  ComponentProps<typeof AlertDialogPrimitive.Portal>
>(({ ...props }) => {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  );
});

const AlertDialogOverlay = memo<
  ComponentProps<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }) => {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/80 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className,
      )}
      {...props}
    />
  );
});

const AlertDialogContent = memo<
  ComponentProps<typeof AlertDialogPrimitive.Content> & {
    size?: "default" | "sm";
  }
>(({ className, size = "default", ...props }) => {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        data-size={size}
        className={cn(
          "group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-6 rounded-4xl bg-popover p-6 text-popover-foreground ring-1 ring-foreground/5 duration-100 outline-none data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-md data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className,
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
});

const AlertDialogHeader = memo<ComponentProps<"div">>(
  ({ className, ...props }) => {
    return (
      <div
        data-slot="alert-dialog-header"
        className={cn(
          "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-6 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]",
          className,
        )}
        {...props}
      />
    );
  },
);

const AlertDialogFooter = memo<ComponentProps<"div">>(
  ({ className, ...props }) => {
    return (
      <div
        data-slot="alert-dialog-footer"
        className={cn(
          "flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",
          className,
        )}
        {...props}
      />
    );
  },
);

const AlertDialogMedia = memo<ComponentProps<"div">>(
  ({ className, ...props }) => {
    return (
      <div
        data-slot="alert-dialog-media"
        className={cn(
          "mb-2 inline-flex size-16 items-center justify-center rounded-full bg-muted sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-8",
          className,
        )}
        {...props}
      />
    );
  },
);

const AlertDialogTitle = memo<
  ComponentProps<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }) => {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn(
        "font-heading text-lg font-medium sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
        className,
      )}
      {...props}
    />
  );
});

const AlertDialogDescription = memo<
  ComponentProps<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }) => {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(
        "text-sm text-balance text-muted-foreground md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
});

const AlertDialogAction = memo<
  ComponentProps<typeof AlertDialogPrimitive.Action> &
    Pick<ComponentProps<typeof Button>, "variant" | "size">
>(({ className, variant = "default", size = "default", ...props }) => {
  return (
    <Button variant={variant} size={size} asChild>
      <AlertDialogPrimitive.Action
        data-slot="alert-dialog-action"
        className={cn(className)}
        {...props}
      />
    </Button>
  );
});

const AlertDialogCancel = memo<
  ComponentProps<typeof AlertDialogPrimitive.Cancel> &
    Pick<ComponentProps<typeof Button>, "variant" | "size">
>(({ className, variant = "outline", size = "default", ...props }) => {
  return (
    <Button variant={variant} size={size} asChild>
      <AlertDialogPrimitive.Cancel
        data-slot="alert-dialog-cancel"
        className={cn(className)}
        {...props}
      />
    </Button>
  );
});

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
