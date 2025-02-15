import { DreamstateError } from "@/dreamstate/core/error/DreamstateError";
import { IRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";
import { EDreamstateErrorCode, TAnyValue, TQueryListener, TQueryType } from "@/dreamstate/types";
import { isCorrectQueryType, isFunction } from "@/dreamstate/utils/typechecking";

/**
 * Unsubscribes the specified listener from handling queries of a given type.
 *
 * This function removes the provided listener for the given query type from the registry,
 * ensuring it no longer handles future data queries for that type.
 *
 * @template T - The type of the query.
 * @param {TQueryType} queryType - The type of query that the listener should be unsubscribed from.
 * @param {TQueryListener<T, TAnyValue>} listener - The callback listener to be removed from query handling.
 * @param {IRegistry} registry - The current scope registry containing the query providers.
 * @returns {void} This function does not return a value; it performs the unsubscribe action.
 */
export function unRegisterQueryProvider<T extends TQueryType>(
  queryType: T,
  listener: TQueryListener<T, TAnyValue>,
  { QUERY_PROVIDERS_REGISTRY }: IRegistry
): void {
  if (!isFunction(listener)) {
    throw new DreamstateError(EDreamstateErrorCode.INCORRECT_QUERY_PROVIDER, typeof listener);
  } else if (!isCorrectQueryType(queryType)) {
    throw new DreamstateError(EDreamstateErrorCode.INCORRECT_QUERY_TYPE, typeof queryType);
  }

  if (QUERY_PROVIDERS_REGISTRY.has(queryType)) {
    const nextProviders: Array<TQueryListener<TAnyValue, TAnyValue>> = QUERY_PROVIDERS_REGISTRY.get(queryType)!.filter(
      function(it: TQueryListener<TAnyValue, TAnyValue>): boolean {
        return it !== listener;
      }
    );

    if (nextProviders.length) {
      QUERY_PROVIDERS_REGISTRY.set(queryType, nextProviders);
    } else {
      QUERY_PROVIDERS_REGISTRY.delete(queryType);
    }
  }
}
