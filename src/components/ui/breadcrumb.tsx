import { cn } from "cn";
import { Slot } from "radix-ui";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  MoreHorizontalCircle01Icon,
} from "@hugeicons/core-free-icons";
import type { ComponentProps } from "react";
import { memo } from "react";

const Breadcrumb = memo<ComponentProps<"nav">>(({ className, ...props }) => {
  return (
    <nav
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      className={cn(className)}
      {...props}
    />
  );
});

const BreadcrumbList = memo<ComponentProps<"ol">>(({ className, ...props }) => {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-muted-foreground sm:gap-2.5",
        className,
      )}
      {...props}
    />
  );
});

const BreadcrumbItem = memo<ComponentProps<"li">>(({ className, ...props }) => {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  );
});

const BreadcrumbLink = memo<
  ComponentProps<"a"> & {
    asChild?: boolean;
  }
>(({ asChild, className, ...props }) => {
  const Comp = asChild ? Slot.Root : "a";

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
    />
  );
});

const BreadcrumbPage = memo<ComponentProps<"span">>(
  ({ className, ...props }) => {
    return (
      <span
        data-slot="breadcrumb-page"
        role="link"
        aria-disabled="true"
        aria-current="page"
        className={cn("font-normal text-foreground", className)}
        {...props}
      />
    );
  },
);

const BreadcrumbSeparator = memo<ComponentProps<"li">>(
  ({ children, className, ...props }) => {
    return (
      <li
        data-slot="breadcrumb-separator"
        role="presentation"
        aria-hidden="true"
        className={cn("[&>svg]:size-3.5", className)}
        {...props}
      >
        {children ?? <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />}
      </li>
    );
  },
);

const BreadcrumbEllipsis = memo<ComponentProps<"span">>(
  ({ className, ...props }) => {
    return (
      <span
        data-slot="breadcrumb-ellipsis"
        role="presentation"
        aria-hidden="true"
        className={cn(
          "flex size-5 items-center justify-center [&>svg]:size-4",
          className,
        )}
        {...props}
      >
        <HugeiconsIcon icon={MoreHorizontalCircle01Icon} strokeWidth={2} />
        <span className="sr-only">More</span>
      </span>
    );
  },
);

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
