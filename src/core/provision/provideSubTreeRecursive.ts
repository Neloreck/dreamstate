
import { CONTEXT_STATES_REGISTRY } from "@Lib/core/internals";
import { TAnyContextManagerConstructor } from "@Lib/core/types";
import { createElement, ReactElement } from "react";

/**
 * Subtree provider as global scope helper.
 * Recursive impl.
 */
export function provideSubTreeRecursive(
  bottom: ReactElement,
  sources: Array<TAnyContextManagerConstructor>,
  current: number
): ReactElement {
  return current >= sources.length
    ? bottom
    : createElement(
      sources[current].REACT_CONTEXT.Provider,
      { value: CONTEXT_STATES_REGISTRY.get(sources[current]) },
      provideSubTreeRecursive(bottom, sources, current + 1)
    );
}
