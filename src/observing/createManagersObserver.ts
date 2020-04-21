import { ComponentType, createElement, memo, ReactElement, useCallback, useState } from "react";

import { EMPTY_ARR, } from "../internals";
import { IStringIndexed, TAnyContextManagerConstructor, } from "../types";
import { useLazyInitializeManager } from "./useLazyInitializeManager";
import { provideSubTree } from "./provideSubTree";

import { log } from "../../build/macroses/log.macro";

/**
 * Utility method for observers creation.
 */
export function createManagersObserver(
  children: ComponentType | null,
  sources: Array<TAnyContextManagerConstructor>
) {
  // Create observer component that will handle observing.
  function Observer(props: IStringIndexed<any>): ReactElement {
    // Update providers subtree utility.
    const [ , updateState ] = useState();
    const updateProviders = useCallback(function () { updateState({}); }, EMPTY_ARR);

    // Subscribe to tree updater and lazily get first context value.
    for (let it = 0; it < sources.length; it ++) {
      useLazyInitializeManager(sources[it], updateProviders);
    }

    return provideSubTree(0, (children ? createElement(children, props) : props.children), sources);
  }

  Observer.displayName = "DS.Observer";

  log.info("Context manager observer created:", Observer.displayName);

  // Hoc helper for decorated components to prevent odd renders.
  return memo(Observer) as any;
}
