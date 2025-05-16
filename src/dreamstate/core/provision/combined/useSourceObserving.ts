import { useContext, useEffect, useMemo } from "react";

import { log } from "@/macroses/log.macro";

import { IScopeContext, ScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { useForceUpdate } from "@/dreamstate/core/utils/useForceUpdate";
import { TAnyContextManagerConstructor, TAnyObject, TCallable } from "@/dreamstate/types";

/**
 * A hook used internally for observing and injecting data based on the current scope.
 *
 * This hook consumes the provided context manager classes (`sources`) and the initial state,
 * performing data injection and provisioning within the context of the current scope. It returns
 * the current state registry, which is used for data provisioning throughout the component tree.
 *
 * @param {Array<TAnyContextManagerConstructor>} sources - An array of context manager class references
 *   that will be observed for state changes.
 * @param {TAnyObject | undefined} initialState - The initial state to be used for data provisioning
 *   when the hook is first invoked.
 * @returns {Map<TAnyContextManagerConstructor, TAnyObject>} A map of context manager classes and their
 *   corresponding current states, used for providing data to components.
 */
export function useSourceObserving(
  sources: Array<TAnyContextManagerConstructor>,
  initialState: TAnyObject | undefined
): Map<TAnyContextManagerConstructor, TAnyObject> {
  const scope: IScopeContext = useContext(ScopeContext);
  const forceUpdate: TCallable = useForceUpdate();

  /*
   * Warn if current observer is mounted out of scope in dev mode.
   */
  if (IS_DEV) {
    if (!scope) {
      log.error("Dreamstate providers should be used in a scope. Wrap your component tree with ScopeProvider");
    }
  }

  /*
   * Use memo for first and single init of required components.
   * The point is to force registering before provider rendering for first init.
   *
   * Registering will work in the same way even if it is called multiple times.
   * Dependencies array is mostly used for HMR updates to force reloading on class reference changes.
   */
  useMemo(function(): void {
    for (let it = 0; it < sources.length; it ++) {
      scope.INTERNAL.registerManager(sources[it], initialState);
    }
  }, sources);

  /*
   * Mount current observers and trigger related lifecycle methods when needed.
   * Count references of providers to detect whether we start provisioning or ending it.
   *
   * ! Iteration order is related to actual tree mount-unmount order imitating.
   * ! Dependencies array is mostly used for HMR updates to force reloading on class reference changes.
   */
  useEffect(function(): TCallable {
    let isSomethingRegistered: boolean = false;

    for (let it = sources.length - 1; it >= 0; it --) {
      /*
       * If something is registered, memoize it and force update to sync useEffect and actual provision tree.
       */
      const registered: boolean = scope.INTERNAL.registerManager(sources[it], initialState);

      scope.INTERNAL.addServiceObserver(sources[it], forceUpdate);

      /*
       * Should stick to 'false' until at least one result is 'true'.
       */
      isSomethingRegistered = registered || isSomethingRegistered;
    }

    /*
     * Re-sync scope providers if something was registered.
     * Normally happens with HMR chunks exchange and caused problems that use react context without subscription.
     * Required to force render of subscribed components after HMR with newest fast-refresh plugins.
     */
    if (isSomethingRegistered) {
      forceUpdate();
    }

    return function(): void {
      for (let it = 0; it < sources.length; it ++) {
        scope.INTERNAL.removeServiceObserver(sources[it], forceUpdate);
      }
    };
  }, sources);

  return scope.INTERNAL.REGISTRY.CONTEXT_STATES_REGISTRY;
}
