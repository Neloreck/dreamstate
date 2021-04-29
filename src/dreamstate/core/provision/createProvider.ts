import { FunctionComponent, ReactNode, useCallback, useState } from "react";

import { EMPTY_ARR } from "@/dreamstate/core/internals";
import { useHotObservers } from "@/dreamstate/core/observing/useHotObservers";
import { useStaticObservers } from "@/dreamstate/core/observing/useStaticObservers";
import { provideSubTreeRecursive } from "@/dreamstate/core/provision/provideSubTreeRecursive";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { ContextService } from "@/dreamstate/core/services/ContextService";
import {
  TAnyContextManagerConstructor,
  TAnyContextServiceConstructor,
  TAnyObject
} from "@/dreamstate/types";

export interface IProviderProps<T> {
  initialState?: T;
  partialHotReplacement?: boolean;
  children?: ReactNode;
}

/**
 * Create component for manual provision without HOC/Decorator-like api.
 * Useful if your root is functional component or you are using createComponent api without JSX.
 */
export function createProvider<
  T extends TAnyObject = TAnyObject
>(
  sources: Array<TAnyContextServiceConstructor>
): FunctionComponent<IProviderProps<T>> {
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
  function Observer(props: IProviderProps<T>): ReactNode {
    const [ , forceRender ] = useState({});
    const updateProviders = useCallback(function() {
      forceRender({});
    }, EMPTY_ARR);

    if (props.partialHotReplacement) {
      useHotObservers(sources, props.initialState, updateProviders);
    } else {
      useStaticObservers(sources, props.initialState, updateProviders);
    }

    return provideSubTreeRecursive(props.children, managers, 0);
  }

  if (IS_DEV) {
    Observer.displayName = `Dreamstate.Observer[${sources.map(function(it: TAnyContextServiceConstructor) {
      return it.name;
    })
    }]`;
  } else {
    Observer.displayName = "DS.Observer";
  }

  return Observer as FunctionComponent<IProviderProps<T>>;
}
