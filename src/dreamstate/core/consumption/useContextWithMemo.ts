import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useContext,
  useLayoutEffect,
  useRef,
  useState
} from "react";

import { IScopeContext, ScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { IContextManagerConstructor, TAnyObject, TCallable } from "@/dreamstate/types";

/**
 * Use manager hook with subscribed updates.
 * Same like common useContext hook, but has memo checks based on dependencySelector.
 *
 * It is useful when specific manager has a lot of information that changes often and you do not need
 * all these checks inside your component that requires only single field from state.
 */
export function useContextWithMemo<
  T extends TAnyObject,
  D extends IContextManagerConstructor<T>
>(
  ManagerClass: D,
  dependenciesSelector: (context: T) => Array<any>
): T {
  const scope: IScopeContext = useContext(ScopeContext);
  const observed: MutableRefObject<Array<unknown> | null | undefined> = useRef(undefined);
  const state: [ T, Dispatch<SetStateAction<T>> ]
    = useState(function(): T {
      return scope.INTERNAL.REGISTRY.CONTEXT_STATES_REGISTRY.get(ManagerClass) as T;
    });

  // Calculate changes like react does and fire change only if one of dependencies has updated.
  useLayoutEffect(function(): TCallable {
    const setState: Dispatch<SetStateAction<T>> = state[1];

    /**
     * Callback to update current ref state + actual provided state.
     */
    function updateMemoState(nextObserved: Array<any>, nextContext: T): void {
      observed.current = nextObserved;
      setState(nextContext);
    }

    /**
     * Memo state checker and updater based on current dependency selector callback.
     */
    function checkMemoState(nextContext: T): void {
      const nextObserved: Array<any> = dependenciesSelector(nextContext);

      /**
       * Do not trigger state update first time.
       * On HMR reloads force state update.
       */
      if (observed.current === undefined) {
        observed.current = nextObserved;
      } else if (observed.current === null) {
        return updateMemoState(nextObserved, nextContext);
      }

      for (let it = 0; it < nextObserved.length; it ++) {
        if (observed.current[it] !== nextObserved[it]) {
          return updateMemoState(nextObserved, nextContext);
        }
      }
    }

    /**
     * Set ref after mount, update state if Manager dependency changes on hot reload/something changes in between.
     *
     * ! Will be triggered after HMR for data initialization and checking.
     */
    checkMemoState(scope.INTERNAL.REGISTRY.CONTEXT_STATES_REGISTRY.get(ManagerClass) as T);

    /**
     * Returns un-subscriber callback.
     */
    scope.INTERNAL.subscribeToManager(ManagerClass, checkMemoState);

    return function(): void {
      // Reset current observables state for following update if something has changed.
      observed.current = null;
      scope.INTERNAL.unsubscribeFromManager(ManagerClass, checkMemoState);
    };
  }, [ ManagerClass, scope.INTERNAL ]);

  return state[0];
}
