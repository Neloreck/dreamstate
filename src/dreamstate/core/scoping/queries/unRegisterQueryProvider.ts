import { IRegistry } from "@/dreamstate/core/registry/createRegistry";
import { TQueryListener, TQueryType } from "@/dreamstate/types";

/**
 * Unsubscribe from all queries for specified listener.
 * Not intended to be used as core feature, just for some elegant decisions.
 */
export function unRegisterQueryProvider<T extends TQueryType>(
  queryType: T,
  listener: TQueryListener<T, any>,
  { QUERY_PROVIDERS_REGISTRY }: IRegistry
): void {
  if (typeof listener !== "function") {
    throw new Error(`Query provider must be factory function, '${typeof listener}' provided.`);
  }

  if (QUERY_PROVIDERS_REGISTRY.has(queryType)) {
    const nextProviders: Array<TQueryListener<any, any>> = QUERY_PROVIDERS_REGISTRY
      .get(queryType)!
      .filter(function(it: TQueryListener<any, any>) {
        return it !== listener;
      });

    if (nextProviders.length) {
      QUERY_PROVIDERS_REGISTRY.set(queryType, nextProviders);
    } else {
      QUERY_PROVIDERS_REGISTRY.delete(queryType);
    }
  }
}
