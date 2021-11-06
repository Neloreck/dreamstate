import { IRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";
import { TQueryListener, TQueryType } from "@/dreamstate/types";
import { isCorrectQueryType, isFunction } from "@/dreamstate/utils/typechecking";

/**
 * Unsubscribe from all queries for specified listener and type.
 *
 * @param {TQueryType} queryType - type of query for data provisioning.
 * @param {TQueryListener} listener - callback that will listen data queries and return requested data.
 * @param {IRegistry} registry - current scope registry.
 * @returns {TCallable} function that unsubscribes subscribed handler.
 */
export function unRegisterQueryProvider<T extends TQueryType>(
  queryType: T,
  listener: TQueryListener<T, any>,
  { QUERY_PROVIDERS_REGISTRY }: IRegistry
): void {
  if (!isFunction(listener)) {
    throw new Error(`Query provider must be factory function, '${typeof listener}' provided.`);
  } else if (!isCorrectQueryType(queryType)) {
    throw new TypeError(`Unexpected query type provided, expected symbol, string or number. Got: ${typeof queryType}.`);
  }

  if (QUERY_PROVIDERS_REGISTRY.has(queryType)) {
    const nextProviders: Array<TQueryListener<any, any>> = QUERY_PROVIDERS_REGISTRY.get(queryType)!.filter(function(
      it: TQueryListener<any, any>
    ) {
      return it !== listener;
    });

    if (nextProviders.length) {
      QUERY_PROVIDERS_REGISTRY.set(queryType, nextProviders);
    } else {
      QUERY_PROVIDERS_REGISTRY.delete(queryType);
    }
  }
}
