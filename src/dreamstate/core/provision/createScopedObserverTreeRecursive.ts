import { createElement, ReactNode } from "react";

import { IProviderProps } from "@/dreamstate/core/provision/createProvider";
import { ScopedObserver } from "@/dreamstate/core/provision/ScopedObserver";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { TAnyContextManagerConstructor, TAnyObject } from "@/dreamstate/types";

/**
 * Subtree provider as global scope helper.
 * Recursive impl.
 */
export function createScopedObserverTreeRecursive<T extends TAnyObject>(
  sources: Array<TAnyContextManagerConstructor>,
  props: IProviderProps<T>,
  scope: IScopeContext,
  current: number = 0
): ReactNode {
  return current >= sources.length
    ? props.children
    : createElement(
      ScopedObserver,
      { manager: sources[current], initialState: props.initialState, dependencies: sources, scope },
      createScopedObserverTreeRecursive(sources, props, scope,current + 1)
    );
}
