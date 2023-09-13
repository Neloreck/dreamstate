import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

import { IScopeContext, ScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { IContextManagerConstructor, TAnyObject, TCallable } from "@/dreamstate/types";

/**
 * Use manager hook with subscribed updates.
 * Same like common useContext hook, but has memo checks based on dependencySelector.
 *
 * It is useful when specific manager has a lot of information that changes often and you do not need
 * all these checks inside your component that requires only single field from state.
 */
export function useContextWithMemo<T extends TAnyObject, D extends IContextManagerConstructor<T>>(
  ManagerClass: D,
  dependenciesSelector: (context: T) => Array<unknown>
): T {
  const scope: IScopeContext = useContext(ScopeContext);
  const state: [T, Dispatch<SetStateAction<T>>] = useState(function(): T {
    return scope.INTERNAL.REGISTRY.CONTEXT_STATES_REGISTRY.get(ManagerClass) as T;
  });

  /**
   * Fire state change only if any of dependencies is updated.
   */
  useEffect(
    function(): TCallable {
      const initialState: T = state[0];
      const setState: Dispatch<SetStateAction<T>> = state[1];
      const subscriptionState: T = scope.INTERNAL.REGISTRY.CONTEXT_STATES_REGISTRY.get(ManagerClass) as T || null;

      // Flag `null` if HMR/StrictMode reset happen, usually just means HMR manager replacing or react 18 strict mode.
      let observed: Array<unknown> | null = subscriptionState ? dependenciesSelector(subscriptionState) : null;

      /**
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
    [ ManagerClass, scope.INTERNAL ]
  );

  return state[0];
}
