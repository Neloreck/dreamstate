import { createElement, ReactChild, ReactElement, useEffect, useMemo, useReducer } from "react";

import { CONTEXT_STATES_REGISTRY } from "@/dreamstate/core/internals";
import { startServiceObserving } from "@/dreamstate/core/observing/startServiceObserving";
import { stopServiceObserving } from "@/dreamstate/core/observing/stopServiceObserving";
import { forceUpdateReducer } from "@/dreamstate/core/provision/forceUpdateReducer";
import { addServiceObserverToRegistry } from "@/dreamstate/core/registry/addServiceObserverToRegistry";
import { registerService } from "@/dreamstate/core/registry/registerService";
import { removeServiceObserverFromRegistry } from "@/dreamstate/core/registry/removeServiceObserverFromRegistry";
import { TAnyContextManagerConstructor } from "@/dreamstate/types";

export interface IScopedObserverProps<T> {
  children?: ReactChild;
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
  manager
}: IScopedObserverProps<T>): ReactElement {
  const [ , onUpdateNeeded ] = useReducer(forceUpdateReducer, null);

  /**
   * Use memo for first and single init of required components.
   * useLayoutEffect will not work for some environments and SSR.
   *
   * Note: Shared between components that do mount-unmount is the same node.
   */
  useMemo(function(): void {
    registerService(manager, initialState);
  }, [ dependencies ]);

  /**
   * Mount current observers.
   * Count references of providers to detect whether we start provisioning or ending it.
   *
   * todo: check option where we do not unload state on HMR reload
   * todo: check option where we trigger full reload on HMR with scoped providers
   */
  useEffect(function() {
    addServiceObserverToRegistry(manager, onUpdateNeeded);
    registerService(manager, initialState);
    startServiceObserving(manager);

    return function() {
      removeServiceObserverFromRegistry(manager, onUpdateNeeded);
      stopServiceObserving(manager);
    };
  }, [ dependencies ]);

  return createElement(manager.REACT_CONTEXT.Provider, { value: CONTEXT_STATES_REGISTRY.get(manager) }, children);
}
