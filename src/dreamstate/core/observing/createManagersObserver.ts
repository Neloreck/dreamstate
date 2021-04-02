import {
  ComponentType,
  createElement,
  memo,
  MutableRefObject,
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
import {
  IStringIndexed,
  TAnyContextManagerConstructor,
  TAnyContextServiceConstructor
} from "@/dreamstate/types";

/**
 * Utility method for observers creation.
 */
export function createManagersObserver(
  children: ComponentType | null,
  sources: Array<TAnyContextServiceConstructor>
) {
  if (!Array.isArray(sources)) {
    throw new TypeError(
      "Wrong providers parameter supplied. Only array of context services is acceptable."
    );
  }

  for (let it = 0; it < sources.length; it ++) {
    if (!sources[it] || !(sources[it].prototype instanceof ContextService)) {
      throw new TypeError("Only classes extending ContextService can be supplied for provision.");
    }
  }

  // todo: Validate duplicates for dev bundle? Should not be an issue since context value is always same.

  /**
   * Check only managers with required provision.
   * Do not include services for subTree rendering but add registering logic for services.
   */
  const managers: Array<TAnyContextManagerConstructor> = sources.filter(function(
    Service: TAnyContextServiceConstructor
  ) {
    return Service.prototype instanceof ContextManager;
  }) as Array<TAnyContextManagerConstructor>;

  /**
   * Create observer component that will handle observing.
   */
  function Observer(props: IStringIndexed<any>): ReactElement {
    const [ , forceRender ] = useState({});
    const updateProviders = useCallback(function() {
      forceRender({});
    }, EMPTY_ARR);

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
        registerService(sources[it], props.initialState);
      }
    }, sources);

    /**
     * Mount current observers.
     * Count references of providers to detect whether we start provisioning or ending it.
     */
    useEffect(function() {
      for (let it = 0; it < viewState.current.observedSources.length; it ++) {
        addServiceObserverToRegistry(viewState.current.observedSources[it], updateProviders);
        registerService(viewState.current.observedSources[it]);
        startServiceObserving(viewState.current.observedSources[it]);
      }

      /**
       * Unmount current observers.
       */
      return function() {
        viewState.current.isProvisionDisposing = true;

        for (let it = viewState.current.observedSources.length - 1; it >= 0; it --) {
          removeServiceObserverFromRegistry(viewState.current.observedSources[it], updateProviders);
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
            addServiceObserverToRegistry(sources[it], updateProviders);
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
    Observer.displayName = `Dreamstate.Observer[${sources.map(function(it: TAnyContextServiceConstructor) {
      return it.name;
    })
    }]`;
  } else {
    Observer.displayName = "DS.Observer";
  }

  // Hoc helper for decorated components to prevent odd renders.
  return memo(Observer) as any;
}
