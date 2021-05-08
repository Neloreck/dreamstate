import { createElement, ReactChild, ReactElement, useEffect, useMemo, useReducer } from "react";

import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { forceUpdateReducer } from "@/dreamstate/core/utils/forceUpdateReducer";
import { TAnyContextManagerConstructor, TCallable } from "@/dreamstate/types";

export interface IScopedObserverProps<T> {
  children?: ReactChild;
  ManagerClass: TAnyContextManagerConstructor;
  scope: IScopeContext;
  initialState?: T;
  dependencies: Array<TAnyContextManagerConstructor>;
}

/**
 * ScopedObserver component that does data provision for specific source in an isolated react node.
 * Receives current scope information and specific manager reference for provision.
 */
export function ScopedObserver<T>({
  children,
  initialState,
  dependencies,
  ManagerClass,
  scope
}: IScopedObserverProps<T>): ReactElement {
  const [ , onUpdateNeeded ] = useReducer(forceUpdateReducer, null);

  /**
   * Use memo for first and single init of required components.
   * The point is to force registering before provider rendering for first init.
   *
   * Registering will work in the same way even if it is called multiple times.
   * Dependencies array is mostly used for HMR updates to force reloading on class reference changes.
   */
  useMemo(function(): void {
    scope.registerService(ManagerClass, initialState);
  }, dependencies);

  /**
   * Mount current observers and trigger related lifecycle methods when needed.
   * Count references of providers to detect whether we start provisioning or ending it.
   *
   * ! Dependencies array is mostly used for HMR updates to force reloading on class reference changes.
   */
  useEffect(function(): TCallable {
    scope.addServiceObserver(ManagerClass, onUpdateNeeded);
    scope.registerService(ManagerClass, initialState);
    scope.incrementServiceObserving(ManagerClass);

    return function(): void {
      scope.removeServiceObserver(ManagerClass, onUpdateNeeded);
      scope.decrementServiceObserving(ManagerClass);
    };
  }, dependencies);

  /**
   * Create simple react provider based on current ManagerClass and provide data from scope registry.
   */
  return createElement(
    ManagerClass.REACT_CONTEXT.Provider,
    { value: scope.REGISTRY.CONTEXT_STATES_REGISTRY.get(ManagerClass) },
    children
  );
}
