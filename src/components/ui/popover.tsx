import { cn } from "cn";
import { Popover as PopoverPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { memo } from "react";

const Popover = memo<ComponentProps<typeof PopoverPrimitive.Root>>(
  ({ ...props }) => {
    return <PopoverPrimitive.Root data-slot="popover" {...props} />;
  },
);

const PopoverTrigger = memo<ComponentProps<typeof PopoverPrimitive.Trigger>>(
  ({ ...props }) => {
    return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
  },
);

const PopoverContent = memo<ComponentProps<typeof PopoverPrimitive.Content>>(
  ({ className, align = "center", sideOffset = 4, ...props }) => {
    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          data-slot="popover-content"
          align={align}
          sideOffset={sideOffset}
          className={cn(
            "z-50 flex w-72 origin-(--radix-popover-content-transform-origin) flex-col gap-4 rounded-2xl bg-popover p-4 text-sm text-popover-foreground shadow-2xl ring-1 ring-foreground/5 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className,
          )}
          {...props}
        />
      </PopoverPrimitive.Portal>
    );
  },
);

const PopoverAnchor = memo<ComponentProps<typeof PopoverPrimitive.Anchor>>(
  ({ ...props }) => {
    return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
  },
);

const PopoverHeader = memo<ComponentProps<"div">>(({ className, ...props }) => {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-1 text-sm", className)}
      {...props}
    />
  );
});

const PopoverTitle = memo<ComponentProps<"h2">>(({ className, ...props }) => {
  return (
    <div
      data-slot="popover-title"
      className={cn("text-base font-medium", className)}
      {...props}
    />
  );
});

const PopoverDescription = memo<ComponentProps<"p">>(
  ({ className, ...props }) => {
    return (
      <p
        data-slot="popover-description"
        className={cn("text-muted-foreground", className)}
        {...props}
      />
    );
  },
);

export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
};
