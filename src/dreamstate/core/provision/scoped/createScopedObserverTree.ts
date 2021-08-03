import { createElement, ReactNode } from "react";

import { ScopedObserver } from "@/dreamstate/core/provision/scoped/ScopedObserver";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { TAnyContextManagerConstructor, TAnyObject } from "@/dreamstate/types";
import { IProviderProps } from "@/dreamstate/types/provision";

/**
 * Recursive implementation for react elements creation in current node scope.
 *
 * @param {Array.<TAnyContextManagerConstructor>>} sources - array of provided context manager class references.
 * @param {Object} props - properties of current parent observer.
 * @param {Object} scope - current observing and provision scope.
 * @param {number} current - recursive rendering iterator.
 */
export function createScopedObserverTree<T extends TAnyObject>(
  sources: Array<TAnyContextManagerConstructor>,
  props: IProviderProps<T>,
  scope: IScopeContext,
  current: number = 0
): ReactNode {
  /**
   * Wrap children node with observers until all source observer elements are created.
   */
  return current >= sources.length
    ? props.children
    : createElement(
      ScopedObserver,
      {
        ManagerClass: sources[current],
        initialState: props.initialState,
        dependencies: sources,
        scope
      },
      createScopedObserverTree(sources, props, scope, current + 1)
    );
}
