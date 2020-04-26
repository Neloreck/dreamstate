import { createElement, ReactElement } from "react";

import { CONTEXT_STATES_REGISTRY } from "../internals";
import { TAnyContextManagerConstructor } from "../types";

/**
 * Subtree provider as global scope helper.
 * Recursive impl.
 */
export function provideSubTreeRecursive(
  current: number,
  bottom: ReactElement,
  sources: Array<TAnyContextManagerConstructor>
): ReactElement {
  return current >= sources.length
    ? bottom
    : createElement(
      sources[current].REACT_CONTEXT.Provider,
      { value: CONTEXT_STATES_REGISTRY.get(sources[current]) },
      provideSubTreeRecursive(current + 1, bottom, sources)
    );
}
