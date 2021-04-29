import { MutableRefObject, useEffect, useRef, useState } from "react";

import { CONTEXT_STATES_REGISTRY } from "@/dreamstate/core/internals";
import { subscribeToManager } from "@/dreamstate/core/registry/subscribeToManager";
import { IContextManagerConstructor, TAnyObject, TUpdateSubscriber } from "@/dreamstate/types";

/**
 * Use manager hook with subscribed updates.
 * Same like common useContext hook, but has memo checks.
 *
 * It is useful when specific manager has a lot of information that changes often and you do not need
 * all these checks inside your component that requires only single field from state.
 */
export function useContextWithMemo<
  T extends TAnyObject,
  S extends TAnyObject,
  D extends IContextManagerConstructor<S, T>
>(
  Manager: D,
  depsSelector: (context: T) => Array<any>
): T {
  const observed: MutableRefObject<Array<any> | null> = useRef(null);
  const [ state, setState ] = useState(function() {
    return CONTEXT_STATES_REGISTRY.get(Manager) as T;
  });

  // Calculate changes like react core does and fire change only after update.
  useEffect(function() {
    const updateMemoState = function(nextObserved: Array<any>, nextContext: T): void {
      observed.current = nextObserved;
      setState(nextContext);
    };

    const checkMemoState: TUpdateSubscriber<T> = function(nextContext: T): void {
      const nextObserved: Array<any> = depsSelector(nextContext);

      if (!observed.current) {
        return updateMemoState(nextObserved, nextContext);
      }

      for (let it = 0; it < nextObserved.length; it ++) {
        if (observed.current[it] !== nextObserved[it]) {
          return updateMemoState(nextObserved, nextContext);
        }
      }
    };

    // Set ref after mount, update state if Manager dependency changes on hot reload/something changes in between.
    checkMemoState(CONTEXT_STATES_REGISTRY.get(Manager) as T);

    return subscribeToManager(Manager, checkMemoState);
  }, [ Manager ]);

  return state;
}
