import { IRegistry } from "@/dreamstate/core/registry/createRegistry";
import { unRegisterQueryProvider } from "@/dreamstate/core/scoping/queries/unRegisterQueryProvider";
import { TCallable, TQueryListener, TQueryType } from "@/dreamstate/types";

/**
 * Register as query provider and answer calls.
 * Should be filtered by users like redux does.
 * Not intended to be used as core feature, just for some elegant decisions.
 *
 * Returns function that unsubscribe current handler.
 */
export function registerQueryProvider<T extends TQueryType>(
  queryType: T,
  listener: TQueryListener<T, any>,
  { QUERY_PROVIDERS_REGISTRY }: IRegistry
): TCallable {
  if (typeof listener !== "function") {
    throw new Error(`Query provider must be factory function, '${typeof listener}' provided.`);
  }

  if (QUERY_PROVIDERS_REGISTRY.has(queryType)) {
    const currentProviders: Array<TQueryListener<any, any>> = QUERY_PROVIDERS_REGISTRY.get(queryType)!;

    // Do not overwrite same listeners.
    if (!currentProviders.includes(listener)) {
      currentProviders.unshift(listener);
    }
  } else {
    // Just add new entry.
    QUERY_PROVIDERS_REGISTRY.set(queryType, [ listener ]);
  }

  return function() {
    unRegisterQueryProvider(queryType, listener, QUERY_PROVIDERS_REGISTRY);
  };
}
