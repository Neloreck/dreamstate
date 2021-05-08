import { FunctionComponent, ReactNode, useContext } from "react";

import { dev } from "@/macroses/dev.macro";

import { createScopedObserverTreeRecursive } from "@/dreamstate/core/provision/scoped/createScopedObserverTreeRecursive";
import { IScopeContext, ScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { TAnyContextManagerConstructor } from "@/dreamstate/types";
import { IProviderProps } from "@/dreamstate/types/provision";

/**
 * Create provider that bundles all observers in a scoped nodes and
 * it does not affect all providers if only one was actually changed.
 */
export function createScopedProvider<T extends IProviderProps<any>>(
  sources: Array<TAnyContextManagerConstructor>
): FunctionComponent<IProviderProps<T>> {
  function Observer(props: T): ReactNode {
    const scope: IScopeContext = useContext(ScopeContext);

    if (IS_DEV) {
      dev.error("Dreamstate providers should be used in a scope. Wrap your component tree with ScopeProvider");
    }

    return createScopedObserverTreeRecursive(sources, props, scope);
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
