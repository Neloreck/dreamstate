import { FunctionComponent, ReactNode } from "react";

import { IProviderProps } from "@/dreamstate/core/provision/createProvider";
import { createScopedProviderTreeRecursive } from "@/dreamstate/core/provision/createScopedProviderTreeRecursive";
import { TAnyContextManagerConstructor } from "@/dreamstate/types";

export function createScopedProvider<T extends IProviderProps<any>>(
  sources: Array<TAnyContextManagerConstructor>
): FunctionComponent<IProviderProps<T>> {
  function Observer(props: T): ReactNode {
    return createScopedProviderTreeRecursive(props.children, sources, 0, props.initialState);
  }

  Observer.displayName = "DS.Provider";

  return Observer as FunctionComponent<IProviderProps<T>>;
}
