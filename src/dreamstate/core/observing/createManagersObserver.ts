import {
  ComponentType,
  createElement,
  memo,
  ReactElement, useCallback, useState
} from "react";

import { EMPTY_ARR } from "@/dreamstate/core/internals";
import { useHotObservers } from "@/dreamstate/core/observing/useHotObservers";
import { useStaticObservers } from "@/dreamstate/core/observing/useStaticObservers";
import { provideSubTreeRecursive } from "@/dreamstate/core/provision/provideSubTreeRecursive";
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

    if (props.partialHotReplacement) {
      useHotObservers(sources, props.initialState, updateProviders);
    } else {
      useStaticObservers(sources, props.initialState, updateProviders);
    }

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
