import { createElement, ReactNode } from "react";

import { ScopedProvider } from "@/dreamstate/core/provision/ScopedProvider";
import { TAnyContextManagerConstructor, TAnyObject } from "@/dreamstate/types";

/**
 * Subtree provider as global scope helper.
 * Recursive impl.
 */
export function createScopedProviderTreeRecursive<T extends TAnyObject>(
  bottom: ReactNode = null,
  sources: Array<TAnyContextManagerConstructor>,
  current: number,
  initialState?: T
): ReactNode {
  return current >= sources.length
    ? bottom
    : createElement(
      ScopedProvider,
      { manager: sources[current], initialState },
      createScopedProviderTreeRecursive(bottom, sources, current + 1, initialState)
    );
}
