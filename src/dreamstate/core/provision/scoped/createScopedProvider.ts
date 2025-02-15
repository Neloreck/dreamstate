import { FunctionComponent, ReactNode, useContext } from "react";

import { log } from "@/macroses/log.macro";

import { createScopedProviderTree } from "@/dreamstate/core/provision/scoped/createScopedProviderTree";
import { IScopeContext, ScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { TAnyContextManagerConstructor, TAnyValue } from "@/dreamstate/types";
import { IProviderProps } from "@/dreamstate/types/provision";

/**
 * Creates a provider that bundles all observers into scoped nodes, ensuring minimal re-renders.
 *
 * This function generates a React provider component that groups all specified context managers into scoped
 * nodes. It efficiently updates only the affected provider when changes occur, preventing unnecessary re-renders
 * for the entire provider tree. This optimization helps improve performance by limiting updates to only the
 * parts of the tree that require them.
 *
 * @template T - The type of the provider props.
 * @param {Array<TAnyContextManagerConstructor>} sources - An array of context manager class references
 *   that should be provided as context within scoped nodes.
 * @returns {FunctionComponent<IProviderProps<T>>} A React function component that acts as a scoped provider
 *   for the specified context manager classes, optimizing re-renders.
 */
export function createScopedProvider<T extends IProviderProps<TAnyValue>>(
  sources: Array<TAnyContextManagerConstructor>
): FunctionComponent<IProviderProps<T>> {
  function Provider(props: T): ReactNode {
    const scope: IScopeContext = useContext(ScopeContext);

    /*
     * Warn if current observer is mounted out of scope in dev mode.
     */
    if (IS_DEV) {
      if (!scope) {
        log.error("Dreamstate providers should be used in a scope. Wrap your component tree with ScopeProvider");
      }
    }

    return createScopedProviderTree(sources, props, scope);
  }

  /*
   * Single wrapper, many observers + providers in isolated scopes.
   */
  if (IS_DEV) {
    Provider.displayName = `Dreamstate.ScopedProviders[${sources.map(function(
      it: TAnyContextManagerConstructor
    ): string {
      return it.name;
    })}]`;
  }

  return Provider as FunctionComponent<IProviderProps<T>>;
}
