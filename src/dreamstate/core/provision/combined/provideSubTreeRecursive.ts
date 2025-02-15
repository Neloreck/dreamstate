import { createElement, ReactNode } from "react";

import { TAnyContextManagerConstructor, TAnyObject } from "@/dreamstate/types";

/**
 * Recursively renders a tree of context providers and wraps the provided component with them.
 *
 * This function generates a React subtree by recursively creating provider components for each context manager
 * in the `sources` array. Each provider in the tree passes down its data to the children components, ensuring that
 * the component tree is properly provided with the necessary context values.
 *
 * @param {ReactNode} bottom - The component (children) that will be wrapped by the context providers.
 * @param {Array<TAnyContextManagerConstructor>} sources - An array of context manager class references that will
 *   provide data via context providers in the React tree.
 * @param {Map<TAnyContextManagerConstructor, TAnyObject>} contextStateRegistry - A map that holds the current
 *   state of each context manager, which will be provided to the corresponding context provider.
 * @param {number} current - The current iteration index for the recursive provider creation process.
 * @returns {ReactNode} A React node representing the tree of context providers, wrapped around the `bottom` component.
 */
export function provideSubTreeRecursive(
  bottom: ReactNode = null,
  sources: Array<TAnyContextManagerConstructor>,
  contextStateRegistry: Map<TAnyContextManagerConstructor, TAnyObject>,
  current: number = 0
): ReactNode {
  /*
   * Wrap children node with providers until all source provider elements are created.
   * Get latest state for provision from current scope registry.
   */
  return current >= sources.length
    ? bottom
    : createElement(
      sources[current].REACT_CONTEXT.Provider,
      { value: contextStateRegistry.get(sources[current]) },
      provideSubTreeRecursive(bottom, sources, contextStateRegistry, current + 1)
    );
}
