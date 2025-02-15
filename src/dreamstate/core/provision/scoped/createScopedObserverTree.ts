import { createElement, ReactNode } from "react";

import { ScopedObserver } from "@/dreamstate/core/provision/scoped/ScopedObserver";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { TAnyContextManagerConstructor, TAnyObject } from "@/dreamstate/types";
import { IProviderProps } from "@/dreamstate/types/provision";

/**
 * Recursively creates React elements within the current node scope for the provided context managers.
 *
 * This function generates React elements by recursively creating observers for each context manager
 * in the `sources` array, wrapping them in their respective context providers. It ensures that the
 * React tree is rendered within the current observation and data provision scope, allowing for
 * scoped data management across the component tree.
 *
 * @template T - The type of the context data being observed and provided.
 * @param {Array<TAnyContextManagerConstructor>} sources - An array of context manager class references
 *   that will be used to create the observer tree.
 * @param {IProviderProps<T>} props - The properties of the current parent observer, which include
 *   context data, dependencies, and other necessary configurations.
 * @param {IScopeContext} scope - The current scope context used for observation and data provisioning.
 * @param {number} [current=0] - The current iteration index for the recursive rendering process.
 * @returns {ReactNode} A React node representing the recursively created observer tree for the given
 *   context managers within the specified scope.
 */
export function createScopedObserverTree<T extends TAnyObject>(
  sources: Array<TAnyContextManagerConstructor>,
  props: IProviderProps<T>,
  scope: IScopeContext,
  current: number = 0
): ReactNode {
  /*
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
        scope,
      },
      createScopedObserverTree(sources, props, scope, current + 1)
    );
}
