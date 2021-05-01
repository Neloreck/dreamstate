import { FunctionComponent, ReactNode } from "react";

import { IProviderProps } from "@/dreamstate/core/provision/createProvider";
import { createScopedObserverTreeRecursive } from "@/dreamstate/core/provision/createScopedObserverTreeRecursive";
import { TAnyContextManagerConstructor } from "@/dreamstate/types";

/**
 * Create provider that bundles all observers in a scoped nodes and
 * it does not affect all providers if only one was actually changed.
 */
export function createScopedProvider<T extends IProviderProps<any>>(
  sources: Array<TAnyContextManagerConstructor>
): FunctionComponent<IProviderProps<T>> {
  function Observer(props: T): ReactNode {
    return createScopedObserverTreeRecursive(sources, props);
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
