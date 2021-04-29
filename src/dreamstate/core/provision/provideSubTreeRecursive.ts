import { createElement, ReactNode } from "react";

import { CONTEXT_STATES_REGISTRY } from "@/dreamstate/core/internals";
import { TAnyContextManagerConstructor } from "@/dreamstate/types";

/**
 * Subtree provider as global scope helper.
 * Recursive impl.
 */
export function provideSubTreeRecursive(
  bottom: ReactNode = null,
  sources: Array<TAnyContextManagerConstructor>,
  current: number
): ReactNode {
  return current >= sources.length
    ? bottom
    : createElement(
      sources[current].REACT_CONTEXT.Provider,
      { value: CONTEXT_STATES_REGISTRY.get(sources[current]) },
      provideSubTreeRecursive(bottom, sources, current + 1)
    );
}
