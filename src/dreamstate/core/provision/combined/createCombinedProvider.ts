import { FunctionComponent, ReactNode } from "react";

import { provideSubTreeRecursive } from "@/dreamstate/core/provision/combined/provideSubTreeRecursive";
import { useSourceObserving } from "@/dreamstate/core/provision/combined/useSourceObserving";
import { TAnyContextManagerConstructor, TAnyObject } from "@/dreamstate/types";
import { IProviderProps } from "@/dreamstate/types/provision";

/**
 * Creates a provider that unifies multiple data sources and attempts to re-render all providers on every update.
 *
 * This function generates a React provider component that observes changes across all specified context
 * managers. This combined provider triggers a re-render for all related provider components whenever any single
 * manager's state is updated.
 *
 * For example, if you have 10 sources, all 10 context provider components will re-render when any one of them
 * updates, and the difference between the current and previous state is matched using React's reference checks.
 *
 * @param {Array<TAnyContextManagerConstructor>} sources - An array of context manager class references
 *   that should be combined into a single provider.
 * @returns {FunctionComponent} A React function component that acts as a combined provider for the specified
 *   context manager classes, ensuring synchronized re-renders across all providers.
 */
export function createCombinedProvider<T extends TAnyObject>(
  sources: Array<TAnyContextManagerConstructor>
): FunctionComponent<IProviderProps<T>> {
  function Observer(props: IProviderProps<T>): ReactNode {
    const registry: Map<TAnyContextManagerConstructor, TAnyObject> = useSourceObserving(sources, props.initialState);

    return provideSubTreeRecursive(props.children, sources, registry);
  }

  /*
   * One observer for all provider sources and many context providers.
   */
  if (IS_DEV) {
    Observer.displayName = `Dreamstate.Observer[${sources.map(function(it: TAnyContextManagerConstructor): string {
      return it.name;
    })}]`;
  }

  return Observer as FunctionComponent<IProviderProps<T>>;
}
