import { createElement, ReactChild, ReactElement, useEffect, useMemo, useReducer } from "react";

import { forceUpdateReducer } from "@/dreamstate/core/provision/forceUpdateReducer";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { TAnyContextManagerConstructor } from "@/dreamstate/types";

export interface IScopedObserverProps<T> {
  children?: ReactChild;
  scope: IScopeContext;
  initialState?: T;
  manager: TAnyContextManagerConstructor;
  dependencies: Array<TAnyContextManagerConstructor>;
}

/**
 * Provider that observes
 */
export function ScopedObserver<T>({
  children,
  initialState,
  dependencies,
  manager,
  scope
}: IScopedObserverProps<T>): ReactElement {
  const [ , onUpdateNeeded ] = useReducer(forceUpdateReducer, null);

  /**
   * Use memo for first and single init of required components.
   * useLayoutEffect will not work for some environments and SSR.
   *
   * Note: Shared between components that do mount-unmount is the same node.
   */
  useMemo(function(): void {
    scope.registerService(manager, initialState);
  }, dependencies);

  /**
   * Mount current observers.
   * Count references of providers to detect whether we start provisioning or ending it.
   */
  useEffect(function() {
    scope.addServiceObserver(manager, onUpdateNeeded);
    scope.registerService(manager, initialState);
    scope.incrementServiceObserving(manager);

    return function() {
      scope.removeServiceObserver(manager, onUpdateNeeded);
      scope.decrementServiceObserving(manager);
    };
  }, dependencies);

  return createElement(
    manager.REACT_CONTEXT.Provider,
    { value: scope.REGISTRY.CONTEXT_STATES_REGISTRY.get(manager) },
    children
  );
}
