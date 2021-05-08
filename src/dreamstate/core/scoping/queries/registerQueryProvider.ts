import { unRegisterQueryProvider } from "@/dreamstate/core/scoping/queries/unRegisterQueryProvider";
import { IRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";
import { TCallable, TQueryListener, TQueryType } from "@/dreamstate/types";

/**
 * Register callback as query provider and answer calls.
 *
 * @param {TQueryType} queryType - type of query for data provisioning.
 * @param {TQueryListener} listener - callback that will listen data queries and return requested data.
 * @param {IRegistry} registry - current scope registry.
 *
 * @return {TCallable} function that unsubscribes subscribed handler.
 */
export function registerQueryProvider<T extends TQueryType>(
  queryType: T,
  listener: TQueryListener<T, any>,
  registry: IRegistry
): TCallable {
  if (typeof listener !== "function") {
    throw new Error(`Query provider must be factory function, '${typeof listener}' provided.`);
  }

  /**
   * Handle query providers as array so for one type many queries can be provided, but only first one will be called.
   */
  if (registry.QUERY_PROVIDERS_REGISTRY.has(queryType)) {
    const currentProviders: Array<TQueryListener<any, any>> = registry.QUERY_PROVIDERS_REGISTRY.get(queryType)!;

    // Do not overwrite same listeners.
    if (!currentProviders.includes(listener)) {
      currentProviders.unshift(listener);
    }
  } else {
    // Just add new entry.
    registry.QUERY_PROVIDERS_REGISTRY.set(queryType, [ listener ]);
  }

  /**
   * Return un-subscriber callback.
   */
  return function(): void {
    unRegisterQueryProvider(queryType, listener, registry);
  };
}
