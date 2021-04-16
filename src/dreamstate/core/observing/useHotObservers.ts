import { MutableRefObject, useEffect, useMemo, useRef } from "react";

import { EMPTY_ARR } from "@/dreamstate/core/internals";
import { startServiceObserving } from "@/dreamstate/core/observing/startServiceObserving";
import { stopServiceObserving } from "@/dreamstate/core/observing/stopServiceObserving";
import { addServiceObserverToRegistry } from "@/dreamstate/core/registry/addServiceObserverToRegistry";
import { registerService } from "@/dreamstate/core/registry/registerService";
import { removeServiceObserverFromRegistry } from "@/dreamstate/core/registry/removeServiceObserverFromRegistry";
import { TAnyContextServiceConstructor, TAnyObject } from "@/dreamstate/types";

/**
 * Use observers dependencies that reload partially on HMR and handle partial updates.
 */
export function useHotObservers(
  sources: Array<TAnyContextServiceConstructor>,
  initialState: TAnyObject | undefined,
  onUpdateNeeded: () => void
): void {
  /**
   * Handle internal observing flags shared between re-renders and lifecycle effects.
   */
  const viewState: MutableRefObject<{
    nextObservedSources: Array<TAnyContextServiceConstructor>;
    observedSources: Array<TAnyContextServiceConstructor>;
    isInitialProvision: boolean;
    isProvisionDisposing: boolean;
  }> = useRef({
    nextObservedSources: sources,
    observedSources: sources,
    isInitialProvision: true,
    isProvisionDisposing: false
  });

  /**
   * Use memo for first and single init of required components.
   * useLayoutEffect will not work for some environments and SSR.
   *
   * Note: Shared between components that do mount-unmount is the same node.
   */
  useMemo(function(): void {
    viewState.current.nextObservedSources = sources;

    for (let it = 0; it < sources.length; it ++) {
      registerService(sources[it], initialState);
    }
  }, sources);

  /**
   * Mount current observers.
   * Count references of providers to detect whether we start provisioning or ending it.
   */
  useEffect(function() {
    for (let it = 0; it < viewState.current.observedSources.length; it ++) {
      addServiceObserverToRegistry(viewState.current.observedSources[it], onUpdateNeeded);
      registerService(viewState.current.observedSources[it], initialState);
      startServiceObserving(viewState.current.observedSources[it]);
    }

    /**
     * Unmount current observers.
     */
    return function() {
      viewState.current.isProvisionDisposing = true;

      for (let it = viewState.current.observedSources.length - 1; it >= 0; it --) {
        removeServiceObserverFromRegistry(viewState.current.observedSources[it], onUpdateNeeded);
        stopServiceObserving(viewState.current.observedSources[it]);
      }
    };
  }, EMPTY_ARR);

  /**
   * Update current observers.
   * Detect whether observers were moved/updated/hot module replacement was activated.
   */
  useEffect(function() {
    if (viewState.current.isInitialProvision) {
      viewState.current.isInitialProvision = false;
    } else {
      for (let it = 0; it < sources.length; it ++) {
        if (viewState.current.observedSources[it] !== sources[it]) {
          addServiceObserverToRegistry(sources[it], onUpdateNeeded);
          registerService(sources[it]);
          startServiceObserving(sources[it]);
        }
      }
    }

    /**
     * Remember current observed sources after HMR replacement or update of dependencies.
     */
    viewState.current.observedSources = sources;

    /**
     * Clean up previous sources after dependencies updates or HMR.
     */
    return function() {
      if (viewState.current.isProvisionDisposing) {
        return;
      } else {
        for (let it = sources.length - 1; it >= 0; it --) {
          if (viewState.current.nextObservedSources[it] !== sources[it]) {
            removeServiceObserverFromRegistry(sources[it], onUpdateNeeded);
            stopServiceObserving(sources[it]);
          }
        }
      }
    };
  }, sources);
}
