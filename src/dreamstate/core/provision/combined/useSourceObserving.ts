import { DispatchWithoutAction, useContext, useEffect, useMemo, useReducer } from "react";

import { log } from "@/macroses/log.macro";

import { IScopeContext, ScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { forceUpdateReducer } from "@/dreamstate/core/utils/forceUpdateReducer";
import { TAnyContextManagerConstructor, TAnyObject, TCallable } from "@/dreamstate/types";

/**
 * Hook for internal usage.
 * Consumes current scope and does injection and data provision based on it.
 * Returns current state registry for data provisioning.
 */
export function useSourceObserving(
  sources: Array<TAnyContextManagerConstructor>,
  initialState: TAnyObject | undefined
): Map<TAnyContextManagerConstructor, TAnyObject> {
  const scope: IScopeContext = useContext(ScopeContext);
  const reducer: [ TAnyObject | null, DispatchWithoutAction ] = useReducer(forceUpdateReducer, null);

  /**
   * Warn if current observer is mounted out of scope in dev mode.
   */
  if (IS_DEV) {
    if (!scope) {
      log.error("Dreamstate providers should be used in a scope. Wrap your component tree with ScopeProvider");
    }
  }

  /**
   * Use memo for first and single init of required components.
   * The point is to force registering before provider rendering for first init.
   *
   * Registering will work in the same way even if it is called multiple times.
   * Dependencies array is mostly used for HMR updates to force reloading on class reference changes.
   */
  useMemo(function(): void {
    for (let it = 0; it < sources.length; it ++) {
      scope.INTERNAL.registerService(sources[it], initialState);
    }
  }, sources);

  /**
   * Mount current observers and trigger related lifecycle methods when needed.
   * Count references of providers to detect whether we start provisioning or ending it.
   *
   * ! Iteration order is related to actual tree mount-unmount order imitating.
   * ! Dependencies array is mostly used for HMR updates to force reloading on class reference changes.
   */
  useEffect(function(): TCallable {
    const onUpdateNeeded: TCallable = reducer[1];

    for (let it = sources.length - 1; it >= 0; it --) {
      scope.INTERNAL.registerService(sources[it], initialState);
      scope.INTERNAL.addServiceObserver(sources[it], onUpdateNeeded);
    }

    return function(): void {
      for (let it = 0; it < sources.length; it ++) {
        scope.INTERNAL.removeServiceObserver(sources[it], onUpdateNeeded);
      }
    };
  }, sources);

  return scope.INTERNAL.REGISTRY.CONTEXT_STATES_REGISTRY;
}
