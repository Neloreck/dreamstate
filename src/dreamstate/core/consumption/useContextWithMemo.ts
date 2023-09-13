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
      // Flag whether HMR/StrictMode reset happens.
      let isReset: boolean = false;

      const initialState: T = state[0];
      const subscriptionState: T = scope.INTERNAL.REGISTRY.CONTEXT_STATES_REGISTRY.get(ManagerClass) as T || null;

      let observed: Array<unknown> = dependenciesSelector(subscriptionState);

      const setState: Dispatch<SetStateAction<T>> = state[1];

      /**
       * Expected to be skipped first time, when state is picked with selector from registry.
       * Expected to be fired every time ManagerClass is changed - when HMR is called.
       */
      if (initialState !== subscriptionState) {
        // Whether reset or `something_wrong` happens in tree above.
        // Usually just means manager replacing or react 18 strict mode.
        isReset = !subscriptionState;
        setState(subscriptionState);
      }

      return scope.INTERNAL.subscribeToManager(ManagerClass, function(nextContext: T): void {
        if (isReset) {
          isReset = false;

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
