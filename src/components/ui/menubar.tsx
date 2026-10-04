"use client";

import { cn } from "cn";
import { Menubar as MenubarPrimitive } from "radix-ui";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import type { ComponentProps } from "react";
import { memo } from "react";

const Menubar = memo<ComponentProps<typeof MenubarPrimitive.Root>>(
  ({ className, ...props }) => {
    return (
      <MenubarPrimitive.Root
        data-slot="menubar"
        className={cn(
          "flex h-9 items-center rounded-4xl border p-1",
          className,
        )}
        {...props}
      />
    );
  },
);

const MenubarMenu = memo<ComponentProps<typeof MenubarPrimitive.Menu>>(
  ({ ...props }) => {
    return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />;
  },
);

const MenubarGroup = memo<ComponentProps<typeof MenubarPrimitive.Group>>(
  ({ ...props }) => {
    return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />;
  },
);

const MenubarPortal = memo<ComponentProps<typeof MenubarPrimitive.Portal>>(
  ({ ...props }) => {
    return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />;
  },
);

const MenubarRadioGroup = memo<
  ComponentProps<typeof MenubarPrimitive.RadioGroup>
>(({ ...props }) => {
  return (
    <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />
  );
});

const MenubarTrigger = memo<ComponentProps<typeof MenubarPrimitive.Trigger>>(
  ({ className, ...props }) => {
    return (
      <MenubarPrimitive.Trigger
        data-slot="menubar-trigger"
        className={cn(
          "flex items-center rounded-xl px-2 py-0.75 text-sm font-medium outline-hidden select-none hover:bg-muted aria-expanded:bg-muted",
          className,
        )}
        {...props}
      />
    );
  },
);

const MenubarContent = memo<ComponentProps<typeof MenubarPrimitive.Content>>(
  ({
    className,
    align = "start",
    alignOffset = -4,
    sideOffset = 8,
    ...props
  }) => {
    return (
      <MenubarPortal>
        <MenubarPrimitive.Content
          data-slot="menubar-content"
          align={align}
          alignOffset={alignOffset}
          sideOffset={sideOffset}
          className={cn(
            "z-50 min-w-48 origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-2xl bg-popover p-1 text-popover-foreground shadow-2xl ring-1 ring-foreground/5 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
            className,
          )}
          {...props}
        />
      </MenubarPortal>
    );
  },
);

const MenubarItem = memo<
  ComponentProps<typeof MenubarPrimitive.Item> & {
    inset?: boolean;
    variant?: "default" | "destructive";
  }
>(({ className, inset, variant = "default", ...props }) => {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "group/menubar-item relative flex cursor-default items-center gap-2.5 rounded-xl px-3 py-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-9.5 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive!",
        className,
      )}
      {...props}
    />
  );
});

const MenubarCheckboxItem = memo<
  ComponentProps<typeof MenubarPrimitive.CheckboxItem> & {
    inset?: boolean;
  }
>(({ className, children, checked, inset, ...props }) => {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-default items-center gap-2.5 rounded-xl py-2 pr-3 pl-9.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-9.5 data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-3 flex size-4 items-center justify-center [&_svg:not([class*='size-'])]:size-4">
        <MenubarPrimitive.ItemIndicator>
          <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
});

const MenubarRadioItem = memo<
  ComponentProps<typeof MenubarPrimitive.RadioItem> & {
    inset?: boolean;
  }
>(({ className, children, inset, ...props }) => {
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-default items-center gap-2.5 rounded-xl py-2 pr-3 pl-9.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-9.5 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-3 flex size-4 items-center justify-center [&_svg:not([class*='size-'])]:size-4">
        <MenubarPrimitive.ItemIndicator>
          <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  );
});

const MenubarLabel = memo<
  ComponentProps<typeof MenubarPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }) => {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
      data-inset={inset}
      className={cn(
        "px-3.5 py-2.5 text-xs text-muted-foreground data-inset:pl-9.5",
        className,
      )}
      {...props}
    />
  );
});

const MenubarSeparator = memo<
  ComponentProps<typeof MenubarPrimitive.Separator>
>(({ className, ...props }) => {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn("-mx-1 my-1 h-px bg-border/50", className)}
      {...props}
    />
  );
});

const MenubarShortcut = memo<ComponentProps<"span">>(
  ({ className, ...props }) => {
    return (
      <span
        data-slot="menubar-shortcut"
        className={cn(
          "ml-auto text-xs tracking-widest text-muted-foreground group-focus/menubar-item:text-accent-foreground",
          className,
        )}
        {...props}
      />
    );
  },
);

const MenubarSub = memo<ComponentProps<typeof MenubarPrimitive.Sub>>(
  ({ ...props }) => {
    return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />;
  },
);

const MenubarSubTrigger = memo<
  ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }) => {
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-default items-center gap-2 rounded-xl px-3 py-2 text-sm outline-none select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-9.5 data-open:bg-accent data-open:text-accent-foreground [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        strokeWidth={2}
        className="ml-auto size-4"
      />
    </MenubarPrimitive.SubTrigger>
  );
});

const MenubarSubContent = memo<
  ComponentProps<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }) => {
  return (
    <MenubarPrimitive.SubContent
      data-slot="menubar-sub-content"
      className={cn(
        "z-50 min-w-32 origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-2xl bg-popover p-1 text-popover-foreground shadow-2xl ring-1 ring-foreground/5 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        className,
      )}
      {...props}
    />
  );
});

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
};
