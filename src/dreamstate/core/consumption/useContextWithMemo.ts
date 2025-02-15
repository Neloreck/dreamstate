import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

import { IScopeContext, ScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { IContextManagerConstructor, TAnyObject, TCallable } from "@/dreamstate/types";

/**
 * A custom hook that subscribes to context updates with memoization.
 *
 * This hook functions similarly to the standard `useContext` hook but adds memoization based on a dependency selector.
 * It is particularly useful when a context manager contains a large or frequently changing state,
 * yet a component only requires updates for specific parts of that state.
 *
 * @template T - The type of the context state object.
 * @template D - The type of the context manager constructor that provides the context state.
 * @param {D} ManagerClass - The class constructor for the context manager which supplies the context state.
 * @param {(context: T) => unknown[]} dependenciesSelector - A selector of dependencies from the context state.
 *   The hook will re-render the component only when these selected dependencies change.
 * @returns {T} The current context state, memoized based on the provided dependencies.
 */
export function useContextWithMemo<T extends TAnyObject, D extends IContextManagerConstructor<T>>(
  ManagerClass: D,
  dependenciesSelector: (context: T) => Array<unknown>
): T {
  const scope: IScopeContext = useContext(ScopeContext);
  const state: [T, Dispatch<SetStateAction<T>>] = useState(function(): T {
    return scope.INTERNAL.REGISTRY.CONTEXT_STATES_REGISTRY.get(ManagerClass) as T;
  });

  /*
   * Fire state change only if any of dependencies is updated.
   */
  useEffect(
    function(): TCallable {
      const initialState: T = state[0];
      const setState: Dispatch<SetStateAction<T>> = state[1];
      const subscriptionState: T = (scope.INTERNAL.REGISTRY.CONTEXT_STATES_REGISTRY.get(ManagerClass) as T) || null;

      // Flag `null` if HMR/StrictMode reset happen, usually just means HMR manager replacing or react 18 strict mode.
      let observed: Array<unknown> | null = subscriptionState ? dependenciesSelector(subscriptionState) : null;

      /*
       * Expected to be skipped first time, when state is picked with selector from registry.
       * Expected to be fired every time ManagerClass is changed - when HMR is called (state is same, effect triggered).
       */
      if (initialState !== subscriptionState) {
        setState(subscriptionState);
      }

      return scope.INTERNAL.subscribeToManager(ManagerClass, function(nextContext: T): void {
        if (!observed) {
          observed = dependenciesSelector(nextContext);

          return setState(nextContext);
        }

        const nextObserved: Array<unknown> = dependenciesSelector(nextContext);

        for (let it = 0; it < nextObserved.length; it ++) {
          if (observed[it] !== nextObserved[it]) {
            observed = nextObserved;

            return setState(nextContext);
          }
        }
      });
    },
    [ManagerClass, scope.INTERNAL]
  );

  return state[0];
}
