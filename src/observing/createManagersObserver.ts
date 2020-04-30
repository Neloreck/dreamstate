import { ComponentType, createElement, memo, ReactElement, useCallback, useState } from "react";

import { EMPTY_ARR } from "../internals";
import {
  IStringIndexed,
  TAnyContextManagerConstructor,
  TDreamstateWorker
} from "../types";
import { useLazyInitializeWorker } from "./useLazyInitializeWorker";
import { provideSubTreeRecursive } from "./provideSubTreeRecursive";
import { ContextManager, ContextWorker } from "../management";

import { log } from "../../build/macroses/log.macro";

/**
 * Utility method for observers creation.
 */
export function createManagersObserver(children: ComponentType | null, sources: Array<TDreamstateWorker>) {
  if (!Array.isArray(sources)) {
    throw new TypeError(
      "Wrong provider config supplied. Only array of context workers is acceptable."
    );
  }

  // Validate sources.
  // todo: Validate duplicates for dev bundle.
  for (let it = 0; it < sources.length; it ++) {
    if (!sources[it] || !(sources[it].prototype instanceof ContextWorker)) {
      throw new TypeError("Only classes extending ContextWorker can be supplied for provision.");
    }
  }

  // Check only managers with required provision.
  const managers: Array<TAnyContextManagerConstructor> = sources.filter(function (it: TDreamstateWorker) {
    return it.prototype instanceof ContextManager;
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
      useLazyInitializeWorker(sources[it], updateProviders);
    }

    return provideSubTreeRecursive(0, children ? createElement(children, props) : props.children, managers);
  }

  Observer.displayName = "DS.Observer";

  log.info("Context manager observer created:", Observer.displayName);

  // Hoc helper for decorated components to prevent odd renders.
  return memo(Observer) as any;
}
