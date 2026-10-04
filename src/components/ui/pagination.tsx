import { cn } from "cn";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  MoreHorizontalCircle01Icon,
} from "@hugeicons/core-free-icons";

import { Button } from "./button";
import type { ComponentProps } from "react";
import { memo } from "react";

const Pagination = memo<ComponentProps<"nav">>(({ className, ...props }) => {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
});

const PaginationContent = memo<ComponentProps<"ul">>(
  ({ className, ...props }) => {
    return (
      <ul
        data-slot="pagination-content"
        className={cn("flex items-center gap-1", className)}
        {...props}
      />
    );
  },
);

const PaginationItem = memo<ComponentProps<"li">>(({ ...props }) => {
  return <li data-slot="pagination-item" {...props} />;
});

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ComponentProps<typeof Button>, "size"> &
  ComponentProps<"a">;

const PaginationLink = memo<PaginationLinkProps>(
  ({ className, isActive, size = "icon", ...props }) => {
    return (
      <Button
        asChild
        variant={isActive ? "outline" : "ghost"}
        size={size}
        className={cn(className)}
      >
        <a
          aria-current={isActive ? "page" : undefined}
          data-slot="pagination-link"
          data-active={isActive}
          {...props}
        />
      </Button>
    );
  },
);

const PaginationPrevious = memo<
  ComponentProps<typeof PaginationLink> & { text?: string }
>(({ className, text = "Previous", ...props }) => {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("pl-2!", className)}
      {...props}
    >
      <HugeiconsIcon
        icon={ArrowLeft01Icon}
        strokeWidth={2}
        data-icon="inline-start"
      />
      <span className="hidden sm:block">{text}</span>
    </PaginationLink>
  );
});

const PaginationNext = memo<
  ComponentProps<typeof PaginationLink> & { text?: string }
>(({ className, text = "Next", ...props }) => {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("pr-2!", className)}
      {...props}
    >
      <span className="hidden sm:block">{text}</span>
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        strokeWidth={2}
        data-icon="inline-end"
      />
    </PaginationLink>
  );
});

const PaginationEllipsis = memo<ComponentProps<"span">>(
  ({ className, ...props }) => {
    return (
      <span
        aria-hidden
        data-slot="pagination-ellipsis"
        className={cn(
          "flex size-9 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
          className,
        )}
        {...props}
      >
        <HugeiconsIcon icon={MoreHorizontalCircle01Icon} strokeWidth={2} />
        <span className="sr-only">More pages</span>
      </span>
    );
  },
);

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
