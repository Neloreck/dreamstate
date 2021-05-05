import { FunctionComponent, ReactNode } from "react";

import { createCombinedProvider } from "@/dreamstate/core/provision/createCombinedProvider";
import { createScopedProvider } from "@/dreamstate/core/provision/createScopedProvider";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { IContextManagerConstructor, TAnyObject } from "@/dreamstate/types";

export interface ICreateProviderProps {
  isCombined?: boolean;
}

export interface IProviderProps<T> {
  initialState?: T;
  partialHotReplacement?: boolean;
  children?: ReactNode;
}

/**
 * Create component for manual provision without HOC/Decorator-like api.
 * Useful if your root is functional component or you are using createComponent api without JSX.
 *
 * isCombined -> should each component work in a separate scope.
 */
export function createProvider<
  T extends TAnyObject = TAnyObject
>(
  sources: Array<IContextManagerConstructor>,
  { isCombined = true }: ICreateProviderProps = {}
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

  if (isCombined) {
    return createCombinedProvider(sources);
  } else {
    return createScopedProvider(sources);
  }
}
