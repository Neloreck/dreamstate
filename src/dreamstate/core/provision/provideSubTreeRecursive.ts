import { createElement, ReactNode } from "react";

import { TAnyContextManagerConstructor, TAnyObject } from "@/dreamstate/types";

/**
 * Subtree provider as global scope helper.
 * Recursive impl.
 */
export function provideSubTreeRecursive(
  bottom: ReactNode = null,
  sources: Array<TAnyContextManagerConstructor>,
  registry: Map<TAnyContextManagerConstructor, TAnyObject>,
  current: number = 0
): ReactNode {
  return current >= sources.length
    ? bottom
    : createElement(
      sources[current].REACT_CONTEXT.Provider,
      { value: registry.get(sources[current]) },
      provideSubTreeRecursive(bottom, sources, registry, current + 1)
    );
}
