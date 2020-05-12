import { ComponentType, createElement, memo, ReactElement, useCallback, useEffect, useMemo, useState } from "react";

import { EMPTY_ARR } from "../internals";
import {
  IStringIndexed,
  TAnyContextManagerConstructor,
  TDreamstateService
} from "../types";
import { provideSubTreeRecursive } from "../provision/provideSubTreeRecursive";
import { ContextManager, ContextService } from "../management";

import { log } from "../../build/macroses/log.macro";
import { addServiceObserverToRegistry, registerService, removeServiceObserverFromRegistry } from "../registry";

/**
 * Utility method for observers creation.
 */
export function createManagersObserver(children: ComponentType | null, sources: Array<TDreamstateService>) {
  if (!Array.isArray(sources)) {
    throw new TypeError(
      "Wrong provider config supplied. Only array of context services is acceptable."
    );
  }

  // Validate sources.
  // todo: Validate duplicates for dev bundle.
  for (let it = 0; it < sources.length; it ++) {
    if (!sources[it] || !(sources[it].prototype instanceof ContextService)) {
      throw new TypeError("Only classes extending ContextService can be supplied for provision.");
    }
  }

  // Check only managers with required provision.
  const managers: Array<TAnyContextManagerConstructor> = sources.filter(function (Service: TDreamstateService) {
    return Service.prototype instanceof ContextManager;
  }) as Array<TAnyContextManagerConstructor>;

  // Create observer component that will handle observing.
  function Observer(props: IStringIndexed<any>): ReactElement {
    // Update providers subtree utility.
    const [ , updateState ] = useState();
    const updateProviders = useCallback(function () {
      updateState({});
    }, EMPTY_ARR);

    // Subscribe to tree updater and lazily get first context value.
    for (let it = 0; it < sources.length; it ++) {
      useMemo(function (): void {
        registerService(sources[it]);
      }, EMPTY_ARR);

      useEffect(function () {
        addServiceObserverToRegistry(sources[it], updateProviders);

        /**
         * Destructor-like order for services unregistering.
         * React calls all hooks in 0...n order, but it should be like 0...n for start and n...0 for end.
         */
        return function () {
          return removeServiceObserverFromRegistry(sources[sources.length - it - 1], updateProviders);
        };
      }, EMPTY_ARR);
    }

    return provideSubTreeRecursive(children ? createElement(children, props) : props.children, managers, 0);
  }

  Observer.displayName = "DS.Observer";

  log.info("Context manager observer created:", Observer.displayName);

  // Hoc helper for decorated components to prevent odd renders.
  return memo(Observer) as any;
}
