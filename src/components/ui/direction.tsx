"use client";

import { Direction } from "radix-ui";
import type { ComponentProps } from "react";
import { memo } from "react";

const DirectionProvider = memo<
  ComponentProps<typeof Direction.DirectionProvider> & {
    direction?: ComponentProps<typeof Direction.DirectionProvider>["dir"];
  }
>(({ dir, direction, children }) => {
  return (
    <Direction.DirectionProvider dir={direction ?? dir}>
      {children}
    </Direction.DirectionProvider>
  );
});

const useDirection = Direction.useDirection;

export { DirectionProvider, useDirection };
