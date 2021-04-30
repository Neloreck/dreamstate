import { FunctionComponent, ReactNode, useReducer } from "react";

import { useHotObservers } from "@/dreamstate/core/observing/useHotObservers";
import { useStaticObservers } from "@/dreamstate/core/observing/useStaticObservers";
import { provideSubTreeRecursive } from "@/dreamstate/core/provision/provideSubTreeRecursive";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { TAnyContextManagerConstructor, TAnyObject } from "@/dreamstate/types";

function forceUpdateReducer(): TAnyObject | null {
  return {};
}

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
  sources: Array<TAnyContextManagerConstructor>
): FunctionComponent<IProviderProps<T>> {
  if (!Array.isArray(sources)) {
    throw new TypeError(
      "Wrong providers parameter supplied. Only array of context services is acceptable."
    );
  }

  for (let it = 0; it < sources.length; it ++) {
    if (!sources[it] || !(sources[it].prototype instanceof ContextManager)) {
      throw new TypeError("Only classes extending ContextManager can be supplied for provision.");
    }
  }

  /**
   * Create observer component that will handle observing.
   */
  function Observer(props: IProviderProps<T>): ReactNode {
    const [ , updateProviders ] = useReducer(forceUpdateReducer, null);

    if (props.partialHotReplacement) {
      useHotObservers(sources, props.initialState, updateProviders);
    } else {
      useStaticObservers(sources, props.initialState, updateProviders);
    }

    return provideSubTreeRecursive(props.children, sources, 0);
  }

  if (IS_DEV) {
    Observer.displayName = `Dreamstate.Observer[${sources.map(function(it: TAnyContextManagerConstructor) {
      return it.name;
    })
    }]`;
  } else {
    Observer.displayName = "DS.Observer";
  }

  return Observer as FunctionComponent<IProviderProps<T>>;
}
