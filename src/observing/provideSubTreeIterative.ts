import { createElement, ReactElement } from "react";

import { IDENTIFIER_KEY, CONTEXT_STATES_REGISTRY } from "../internals";
import { TAnyContextManagerConstructor } from "../types";

/**
 * Subtree provider as global scope helper.
 * Iterative impl.
 */
export function provideSubTreeIterative(
  current: number,
  bottom: ReactElement,
  sources: Array<TAnyContextManagerConstructor>
): ReactElement {
  let acc: ReactElement = bottom;

  for (let it = sources.length - 1; it >= 0; it --) {
    acc = createElement(
      sources[it].REACT_CONTEXT.Provider,
      { value: CONTEXT_STATES_REGISTRY[sources[it][IDENTIFIER_KEY]] },
      acc
    );
  }

  return acc;
}
