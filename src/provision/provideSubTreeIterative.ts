import { createElement, ReactElement } from "react";

import { CONTEXT_STATES_REGISTRY } from "@Lib/internals";
import { TAnyContextManagerConstructor } from "@Lib/types";

/**
 * Subtree provider as global scope helper.
 * Iterative impl.
 */
export function provideSubTreeIterative(
  bottom: ReactElement,
  sources: Array<TAnyContextManagerConstructor>
): ReactElement {
  let acc: ReactElement = bottom;

  for (let it = sources.length - 1; it >= 0; it --) {
    acc = createElement(
      sources[it].REACT_CONTEXT.Provider,
      { value: CONTEXT_STATES_REGISTRY.get(sources[it]) },
      acc
    );
  }

  return acc;
}
