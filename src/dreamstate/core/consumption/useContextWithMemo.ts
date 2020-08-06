import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";

import { CONTEXT_STATES_REGISTRY, EMPTY_ARR } from "@/dreamstate/core/internals";
import { subscribeToManager } from "@/dreamstate/core/registry/subscribeToManager";
import { unsubscribeFromManager } from "@/dreamstate/core/registry/unSubscribeFromManager";
import { IContextManagerConstructor, TUpdateSubscriber } from "@/dreamstate/types";

/**
 * Use manager hook with subscribed updates.
 * Same like common useContext hook, but has memo checks.
 */
export function useContextWithMemo<T extends object, D extends IContextManagerConstructor<T>>(
  Manager: D,
  depsSelector: (context: T) => Array<any>
): T {
  const [ state, setState ] = useState(function() {
    return CONTEXT_STATES_REGISTRY.get(Manager) as T;
  });
  const observed: MutableRefObject<Array<any>> = useRef(depsSelector(state));

  const updateMemoState: TUpdateSubscriber<T> = useCallback(function(nextContext: T): void {
    // Calculate changes like react core does and fire change only after update.
    const nextObserved = depsSelector(nextContext);

    for (let it = 0; it < nextObserved.length; it ++) {
      if (observed.current[it] !== nextObserved[it]) {
        observed.current = nextObserved;
        setState(nextContext);

        return;
      }
    }
  }, EMPTY_ARR);

  useEffect(function() {
    subscribeToManager(Manager, updateMemoState);

    return function() {
      unsubscribeFromManager(Manager, updateMemoState);
    };
  });

  return state;
}
