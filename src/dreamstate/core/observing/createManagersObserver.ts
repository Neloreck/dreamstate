import {
  ComponentType,
  createElement,
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import { EMPTY_ARR } from "@/dreamstate/core/internals";
import { startServiceObserving } from "@/dreamstate/core/observing/startServiceObserving";
import { stopServiceObserving } from "@/dreamstate/core/observing/stopServiceObserving";
import { provideSubTreeRecursive } from "@/dreamstate/core/provision/provideSubTreeRecursive";
import { addServiceObserverToRegistry } from "@/dreamstate/core/registry/addServiceObserverToRegistry";
import { registerService } from "@/dreamstate/core/registry/registerService";
import { removeServiceObserverFromRegistry } from "@/dreamstate/core/registry/removeServiceObserverFromRegistry";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { ContextService } from "@/dreamstate/core/services/ContextService";
import { IStringIndexed, TAnyContextManagerConstructor, TDreamstateService } from "@/dreamstate/types";

/**
 * Utility method for observers creation.
 *
 * todo: Cleaner code
 * todo: Test multiple mounts
 * todo: Dev only hook?
 */
export function createManagersObserver(children: ComponentType | null, sources: Array<TDreamstateService>) {
  if (!Array.isArray(sources)) {
    throw new TypeError(
      "Wrong provider dreamstate supplied. Only array of context services is acceptable."
    );
  }

  // Validate sources.
  for (let it = 0; it < sources.length; it ++) {
    if (!sources[it] || !(sources[it].prototype instanceof ContextService)) {
      throw new TypeError("Only classes extending ContextService can be supplied for provision.");
    }
  }

  // todo: Validate duplicates for dev bundle? Should not be an issue since context value is always same.

  // Check only managers with required provision.
  // Do not include services for subTree rendering but add registering logic for services.
  const managers: Array<TAnyContextManagerConstructor> = sources.filter(function(Service: TDreamstateService) {
    return Service.prototype instanceof ContextManager;
  }) as Array<TAnyContextManagerConstructor>;

  // Create observer component that will handle observing.
  function Observer(props: IStringIndexed<any>): ReactElement {
    const [ , forceRender ] = useState({});
    const updateProviders = useCallback(function() {
      forceRender({});
    }, EMPTY_ARR);

    // todo: Single ref probably.
    const nextObservedSources = useRef(sources);
    const observedSources = useRef(sources);
    const initialProvision = useRef(true);
    const provisionDisposing = useRef(false);

    /**
     * Use memo for first and single init of required components.
     * useLayoutEffect will not work for some environments and SSR.
     *
     * Note: Shared between components that do mount-unmount is the same node.
     */
    useMemo(function(): void {
      nextObservedSources.current = sources;

      for (let it = 0; it < sources.length; it ++) {
        registerService(sources[it]);
      }
    }, sources);

    /**
     * Mount current observers.
     * Count references of providers to detect whether we start provisioning or ending it.
     */
    useEffect(function() {
      for (let it = 0; it < observedSources.current.length; it ++) {
        addServiceObserverToRegistry(observedSources.current[it], updateProviders);
        registerService(observedSources.current[it]);
        startServiceObserving(observedSources.current[it]);
      }

      /**
       * Unmount current observers.
       */
      return function() {
        provisionDisposing.current = true;

        for (let it = observedSources.current.length - 1; it >= 0; it --) {
          removeServiceObserverFromRegistry(observedSources.current[it], updateProviders);
          stopServiceObserving(observedSources.current[it]);
        }
      };
    }, EMPTY_ARR);

    /**
     * Update current observers.
     * Detect whether observers were moved/updated/hot module replacement was activated.
     */
    useEffect(function() {
      if (initialProvision.current) {
        initialProvision.current = false;
      } else {
        for (let it = 0; it < sources.length; it ++) {
          if (observedSources.current[it] !== sources[it]) {
            addServiceObserverToRegistry(sources[it], updateProviders);
            registerService(sources[it]);
            startServiceObserving(sources[it]);
          }
        }
      }

      observedSources.current = sources;

      /**
       * Clean up previous sources after dependencies updates or HMR.
       */
      return function() {
        if (provisionDisposing.current) {
          return;
        } else {
          for (let it = sources.length - 1; it >= 0; it --) {
            if (nextObservedSources.current[it] !== sources[it]) {
              removeServiceObserverFromRegistry(sources[it], updateProviders);
              stopServiceObserving(sources[it]);
            }
          }
        }
      };
    }, sources);

    return provideSubTreeRecursive(children ? createElement(children, props) : props.children, managers, 0);
  }

  if (IS_DEV) {
    Observer.displayName = `Dreamstate.Observer[${sources.map(function(it: TDreamstateService) {
      return it.name;
    })
    }]`;
  } else {
    Observer.displayName = "DS.Observer";
  }

  // Hoc helper for decorated components to prevent odd renders.
  return memo(Observer) as any;
}
