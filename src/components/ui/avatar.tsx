import { cn } from "cn";
import { Avatar as AvatarPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { memo } from "react";

const Avatar = memo<
  ComponentProps<typeof AvatarPrimitive.Root> & {
    size?: "default" | "sm" | "lg";
  }
>(({ className, size = "default", ...props }) => {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten",
        className,
      )}
      {...props}
    />
  );
});

const AvatarImage = memo<ComponentProps<typeof AvatarPrimitive.Image>>(
  ({ className, ...props }) => {
    return (
      <AvatarPrimitive.Image
        data-slot="avatar-image"
        className={cn(
          "aspect-square size-full rounded-full object-cover",
          className,
        )}
        {...props}
      />
    );
  },
);

const AvatarFallback = memo<ComponentProps<typeof AvatarPrimitive.Fallback>>(
  ({ className, ...props }) => {
    return (
      <AvatarPrimitive.Fallback
        data-slot="avatar-fallback"
        className={cn(
          "flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs",
          className,
        )}
        {...props}
      />
    );
  },
);

const AvatarBadge = memo<ComponentProps<"span">>(({ className, ...props }) => {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground bg-blend-color ring-2 ring-background select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        className,
      )}
      {...props}
    />
  );
});

const AvatarGroup = memo<ComponentProps<"div">>(({ className, ...props }) => {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className,
      )}
      {...props}
    />
  );
});

const AvatarGroupCount = memo<ComponentProps<"div">>(
  ({ className, ...props }) => {
    return (
      <div
        data-slot="avatar-group-count"
        className={cn(
          "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
          className,
        )}
        {...props}
      />
    );
  },
);

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
};
