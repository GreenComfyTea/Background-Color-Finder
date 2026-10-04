import { cn } from "cn";
import type { ComponentProps } from "react";
import { memo } from "react";

const Table = memo<ComponentProps<"table">>(({ className, ...props }) => {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
});

const TableHeader = memo<ComponentProps<"thead">>(({ className, ...props }) => {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  );
});

const TableBody = memo<ComponentProps<"tbody">>(({ className, ...props }) => {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
});

const TableFooter = memo<ComponentProps<"tfoot">>(({ className, ...props }) => {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
});

const TableRow = memo<ComponentProps<"tr">>(({ className, ...props }) => {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
        className,
      )}
      {...props}
    />
  );
});

const TableHead = memo<ComponentProps<"th">>(({ className, ...props }) => {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-12 px-3 text-left align-middle font-medium whitespace-nowrap text-foreground has-[[role=checkbox]]:pr-0",
        className,
      )}
      {...props}
    />
  );
});

const TableCell = memo<ComponentProps<"td">>(({ className, ...props }) => {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-3 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0",
        className,
      )}
      {...props}
    />
  );
});

const TableCaption = memo<ComponentProps<"caption">>(
  ({ className, ...props }) => {
    return (
      <caption
        data-slot="table-caption"
        className={cn("mt-4 text-sm text-muted-foreground", className)}
        {...props}
      />
    );
  },
);

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
