import { createElement, ReactNode } from "react";

import { TAnyContextManagerConstructor, TAnyObject } from "@/dreamstate/types";

/**
 * Subtree provider as global scope helper.
 * Recursive impl.
 */
export function provideSubTreeRecursive(
  bottom: ReactNode = null,
  sources: Array<TAnyContextManagerConstructor>,
  contextStateRegistry: Map<TAnyContextManagerConstructor, TAnyObject>,
  current: number = 0
): ReactNode {
  return current >= sources.length
    ? bottom
    : createElement(
      sources[current].REACT_CONTEXT.Provider,
      { value: contextStateRegistry.get(sources[current]) },
      provideSubTreeRecursive(bottom, sources, contextStateRegistry, current + 1)
    );
}
