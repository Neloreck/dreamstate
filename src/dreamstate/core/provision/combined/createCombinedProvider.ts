import { FunctionComponent, ReactNode } from "react";

import { provideSubTreeRecursive } from "@/dreamstate/core/provision/combined/provideSubTreeRecursive";
import { useSourceObserving } from "@/dreamstate/core/provision/combined/useSourceObserving";
import { TAnyContextManagerConstructor, TAnyObject } from "@/dreamstate/types";
import { IProviderProps } from "@/dreamstate/types/provision";

/**
 * Create provider that unifies all data sources and tries to re-render providers on every update.
 */
export function createCombinedProvider<T extends TAnyObject>(
  sources: Array<TAnyContextManagerConstructor>
): FunctionComponent<IProviderProps<T>> {
  function Observer(props: IProviderProps<T>): ReactNode {
    const registry: Map<TAnyContextManagerConstructor, TAnyObject> = useSourceObserving(sources, props.initialState);

    return provideSubTreeRecursive(props.children, sources, registry);
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
