import { createElement, ReactNode } from "react";

import { TAnyContextManagerConstructor, TAnyObject } from "@/dreamstate/types";

/**
 * Recursive implementation for tree rendering.
 * Creates react sub-tree withing single node for data provision.
 *
 * @param {ReactNode} bottom - children component that will be wrapped by providers.
 * @param {Array} sources - array of source context managers that will provide data with context providers.
 * @param {Map} contextStateRegistry - object that contains current context states that will be provided.
 * @param {number} current - recursive provider creation iterator.
 * @returns {ReactNode} - tree node for react rendering.
 */
export function provideSubTreeRecursive(
  bottom: ReactNode = null,
  sources: Array<TAnyContextManagerConstructor>,
  contextStateRegistry: Map<TAnyContextManagerConstructor, TAnyObject>,
  current: number = 0
): ReactNode {
  /**
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
