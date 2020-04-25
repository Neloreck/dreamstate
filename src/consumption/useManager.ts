import { MutableRefObject, useCallback, useContext, useLayoutEffect, useRef, useState } from "react";

import { IContextManagerConstructor, TUpdateSubscriber } from "../types";
import { CONTEXT_STATES_REGISTRY, EMPTY_ARR, IDENTIFIER_KEY } from "../internals";
import { subscribeToManager, unsubscribeFromManager } from "../registry";

/**
 * Use manager hook with subscribed updates.
 * Same like common useContext hook, but has memo checks.
 */
export function useContextWithMemo<T extends object, D extends IContextManagerConstructor<T>>(
  managerConstructor: D,
  depsSelector: (context: T) => Array<any>
): D["prototype"]["context"] {
  const [ state, setState ] = useState(function () {
    return CONTEXT_STATES_REGISTRY[managerConstructor[IDENTIFIER_KEY]];
  });
  const observed: MutableRefObject<Array<any>> = useRef(depsSelector(state));

  const updateMemoState: TUpdateSubscriber<T> = useCallback(function (nextContext: T): void {
    // Calculate changes like react lib does and fire change only after update.
    const nextObserved = depsSelector(nextContext);

    for (let it = 0; it < nextObserved.length; it ++) {
      if (observed.current[it] !== nextObserved[it]) {
        observed.current = nextObserved;
        setState(nextContext);

        return;
      }
    }
  }, EMPTY_ARR);

  useLayoutEffect(function () {
    subscribeToManager(managerConstructor, updateMemoState);

    return function () {
      unsubscribeFromManager(managerConstructor, updateMemoState);
    };
  });

  return state;
}

/**
 * Use manager hook, higher order wrapper for useContext.
 */
export function useManager<T extends object, D extends IContextManagerConstructor<T>>(
  managerConstructor: D,
  depsSelector?: (context: D["prototype"]["context"]) => Array<any>
): D["prototype"]["context"] {
  if (depsSelector) {
    return useContextWithMemo(managerConstructor, depsSelector);
  } else {
    return useContext(managerConstructor.REACT_CONTEXT);
  }
}
