import { useContext, useEffect, useMemo, useReducer } from "react";

import { dev } from "@/macroses/dev.macro";

import { forceUpdateReducer } from "@/dreamstate/core/utils/forceUpdateReducer";
import { IScopeContext, ScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { TAnyContextManagerConstructor, TAnyObject } from "@/dreamstate/types";

/**
 * Use observers dependencies that reload after changes.
 */
export function useSourceObserving(
  sources: Array<TAnyContextManagerConstructor>,
  initialState: TAnyObject | undefined
): Map<TAnyContextManagerConstructor, TAnyObject> {
  const scope: IScopeContext = useContext(ScopeContext);
  const [ , updateProviders ] = useReducer(forceUpdateReducer, null);

  if (IS_DEV) {
    dev.error("Dreamstate providers should be used in a scope. Wrap your component tree with ScopeProvider");
  }

  /**
   * Use memo for first and single init of required components.
   * useLayoutEffect will not work for some environments and SSR.
   *
   * Note: Shared between components that do mount-unmount is the same node.
   */
  useMemo(function(): void {
    for (let it = 0; it < sources.length; it ++) {
      scope.registerService(sources[it], initialState);
    }
  }, sources);

  /**
   * Mount current observers.
   * Count references of providers to detect whether we start provisioning or ending it.
   */
  useEffect(function() {
    for (let it = sources.length - 1; it >= 0; it --) {
      scope.addServiceObserver(sources[it], updateProviders);
      scope.registerService(sources[it], initialState);
      scope.incrementServiceObserving(sources[it]);
    }

    /**
     * Unmount current observers.
     */
    return function() {
      for (let it = 0; it < sources.length; it ++) {
        scope.removeServiceObserver(sources[it], updateProviders);
        scope.decrementServiceObserving(sources[it]);
      }
    };
  }, sources);

  return scope.REGISTRY.CONTEXT_STATES_REGISTRY;
}
