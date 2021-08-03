import { FunctionComponent, ReactNode, useContext } from "react";

import { log } from "@/macroses/log.macro";

import { createScopedObserverTree } from "@/dreamstate/core/provision/scoped/createScopedObserverTree";
import { IScopeContext, ScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { TAnyContextManagerConstructor } from "@/dreamstate/types";
import { IProviderProps } from "@/dreamstate/types/provision";

/**
 * Create provider that bundles all observers in a scoped nodes and
 * does not affect all providers if only one was actually changed.
 */
export function createScopedProvider<T extends IProviderProps<any>>(
  sources: Array<TAnyContextManagerConstructor>
): FunctionComponent<IProviderProps<T>> {
  function Observer(props: T): ReactNode {
    const scope: IScopeContext = useContext(ScopeContext);

    /**
     * Warn if current observer is mounted out of scope in dev mode.
     */
    if (IS_DEV) {
      if (!scope) {
        log.error("Dreamstate providers should be used in a scope. Wrap your component tree with ScopeProvider");
      }
    }

    return createScopedObserverTree(sources, props, scope);
  }

  /**
   * Single wrapper, many observers + providers in isolated scopes.
   */
  if (IS_DEV) {
    Observer.displayName = `Dreamstate.Observer[${sources.map(function(it: TAnyContextManagerConstructor) {
      return it.name;
    })}]`;
  }

  return Observer as FunctionComponent<IProviderProps<T>>;
}
