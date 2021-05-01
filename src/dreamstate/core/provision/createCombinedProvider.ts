import { FunctionComponent, ReactNode, useReducer } from "react";

import { IProviderProps } from "@/dreamstate/core/provision/createProvider";
import { forceUpdateReducer } from "@/dreamstate/core/provision/forceUpdateReducer";
import { provideSubTreeRecursive } from "@/dreamstate/core/provision/provideSubTreeRecursive";
import { useSourceObserving } from "@/dreamstate/core/provision/useSourceObserving";
import { TAnyContextManagerConstructor, TAnyObject } from "@/dreamstate/types";

/**
 * Create provider that unifies all data sources and tries to re-render providers on every update.
 */
export function createCombinedProvider<T extends TAnyObject>(
  sources: Array<TAnyContextManagerConstructor>
): FunctionComponent<IProviderProps<T>> {
  function Observer(props: IProviderProps<T>): ReactNode {
    const [ , updateProviders ] = useReducer(forceUpdateReducer, null);

    useSourceObserving(sources, props.initialState, updateProviders);

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
