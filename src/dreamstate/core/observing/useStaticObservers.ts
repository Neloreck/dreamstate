import { useCallback, useEffect, useMemo, useState } from "react";

import { startServiceObserving } from "@/dreamstate/core/observing/startServiceObserving";
import { stopServiceObserving } from "@/dreamstate/core/observing/stopServiceObserving";
import { addServiceObserverToRegistry } from "@/dreamstate/core/registry/addServiceObserverToRegistry";
import { registerService } from "@/dreamstate/core/registry/registerService";
import { removeServiceObserverFromRegistry } from "@/dreamstate/core/registry/removeServiceObserverFromRegistry";
import { TAnyContextServiceConstructor, TAnyObject } from "@/dreamstate/types";

/**
 * Use observers dependencies that reload after changes and proceed full reload on HMR.
 */
export function useStaticObservers(
  sources: Array<TAnyContextServiceConstructor>,
  initialState: TAnyObject | undefined,
  onUpdateNeeded: () => void
): void {
  /**
   * Use memo for first and single init of required components.
   * useLayoutEffect will not work for some environments and SSR.
   *
   * Note: Shared between components that do mount-unmount is the same node.
   */
  useMemo(function(): void {
    for (let it = 0; it < sources.length; it ++) {
      registerService(sources[it], initialState);
    }
  }, sources);

  /**
   * Mount current observers.
   * Count references of providers to detect whether we start provisioning or ending it.
   */
  useEffect(function() {
    for (let it = 0; it < sources.length; it ++) {
      addServiceObserverToRegistry(sources[it], onUpdateNeeded);
      registerService(sources[it], initialState);
      startServiceObserving(sources[it]);
    }

    /**
     * Unmount current observers.
     */
    return function() {
      for (let it = sources.length - 1; it >= 0; it --) {
        removeServiceObserverFromRegistry(sources[it], onUpdateNeeded);
        stopServiceObserving(sources[it]);
      }
    };
  }, sources);
}
