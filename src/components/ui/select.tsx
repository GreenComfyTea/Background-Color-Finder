"use client";

import { cn } from "cn";
import { Select as SelectPrimitive } from "radix-ui";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UnfoldMoreIcon,
  Tick02Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";
import type { ComponentProps } from "react";
import { memo } from "react";

const Select = memo<ComponentProps<typeof SelectPrimitive.Root>>(
  ({ ...props }) => {
    return <SelectPrimitive.Root data-slot="select" {...props} />;
  },
);

const SelectGroup = memo<ComponentProps<typeof SelectPrimitive.Group>>(
  ({ className, ...props }) => {
    return (
      <SelectPrimitive.Group
        data-slot="select-group"
        className={cn("scroll-my-1 p-1", className)}
        {...props}
      />
    );
  },
);

const SelectValue = memo<ComponentProps<typeof SelectPrimitive.Value>>(
  ({ ...props }) => {
    return <SelectPrimitive.Value data-slot="select-value" {...props} />;
  },
);

const SelectTrigger = memo<
  ComponentProps<typeof SelectPrimitive.Trigger> & {
    size?: "sm" | "default";
  }
>(({ className, size = "default", children, ...props }) => {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-fit items-center justify-between gap-1.5 rounded-4xl border border-input bg-input/30 px-3 py-2 text-sm whitespace-nowrap transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <HugeiconsIcon
          icon={UnfoldMoreIcon}
          strokeWidth={2}
          className="pointer-events-none size-4 text-muted-foreground"
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});

const SelectContent = memo<ComponentProps<typeof SelectPrimitive.Content>>(
  ({
    className,
    children,
    position = "item-aligned",
    align = "center",
    ...props
  }) => {
    return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          data-slot="select-content"
          data-align-trigger={position === "item-aligned"}
          className={cn(
            "relative z-50 max-h-(--radix-select-content-available-height) min-w-36 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-2xl bg-popover text-popover-foreground shadow-2xl ring-1 ring-foreground/5 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            position === "popper" &&
              "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
            className,
          )}
          position={position}
          align={align}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.Viewport
            data-position={position}
            className={cn(
              "data-[position=popper]:h-(--radix-select-trigger-height) data-[position=popper]:w-full data-[position=popper]:min-w-(--radix-select-trigger-width)",
              position === "popper" && "",
            )}
          >
            {children}
          </SelectPrimitive.Viewport>
          <SelectScrollDownButton />
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    );
  },
);

const SelectLabel = memo<ComponentProps<typeof SelectPrimitive.Label>>(
  ({ className, ...props }) => {
    return (
      <SelectPrimitive.Label
        data-slot="select-label"
        className={cn("px-3 py-2.5 text-xs text-muted-foreground", className)}
        {...props}
      />
    );
  },
);

const SelectItem = memo<ComponentProps<typeof SelectPrimitive.Item>>(
  ({ className, children, ...props }) => {
    return (
      <SelectPrimitive.Item
        data-slot="select-item"
        className={cn(
          "relative flex w-full cursor-default items-center gap-2.5 rounded-xl py-2 pr-8 pl-3 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
          className,
        )}
        {...props}
      >
        <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
          <SelectPrimitive.ItemIndicator>
            <HugeiconsIcon
              icon={Tick02Icon}
              strokeWidth={2}
              className="pointer-events-none"
            />
          </SelectPrimitive.ItemIndicator>
        </span>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      </SelectPrimitive.Item>
    );
  },
);

const SelectSeparator = memo<ComponentProps<typeof SelectPrimitive.Separator>>(
  ({ className, ...props }) => {
    return (
      <SelectPrimitive.Separator
        data-slot="select-separator"
        className={cn(
          "pointer-events-none -mx-1 my-1 h-px bg-border/50",
          className,
        )}
        {...props}
      />
    );
  },
);

const SelectScrollUpButton = memo<
  ComponentProps<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }) => {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={2} />
    </SelectPrimitive.ScrollUpButton>
  );
});

const SelectScrollDownButton = memo<
  ComponentProps<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }) => {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />
    </SelectPrimitive.ScrollDownButton>
  );
});

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
