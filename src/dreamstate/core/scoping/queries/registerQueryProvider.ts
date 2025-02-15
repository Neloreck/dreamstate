import { DreamstateError } from "@/dreamstate/core/error/DreamstateError";
import { unRegisterQueryProvider } from "@/dreamstate/core/scoping/queries/unRegisterQueryProvider";
import { IRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";
import { EDreamstateErrorCode, TCallable, TQueryListener, TQueryType } from "@/dreamstate/types";
import { isCorrectQueryType } from "@/dreamstate/utils/typechecking";

/**
 * Registers a callback as a query provider to handle data queries.
 *
 * This function registers a query provider callback for a given query type in the current
 * scope's registry. The listener will handle incoming data queries and return the requested data.
 *
 * @template T - The type of the query.
 * @param {TQueryType} queryType - The type of query for which data provisioning is provided.
 * @param {TQueryListener<T, any>} listener - The callback that listens to queries and returns
 *   the requested data.
 * @param {IRegistry} registry - The current scope registry where the query provider is registered.
 * @returns {TCallable} A function that, when called, unsubscribes the registered query provider.
 */
export function registerQueryProvider<T extends TQueryType>(
  queryType: T,
  listener: TQueryListener<T, any>,
  registry: IRegistry
): TCallable {
  if (typeof listener !== "function") {
    throw new DreamstateError(EDreamstateErrorCode.INCORRECT_QUERY_PROVIDER, typeof listener);
  } else if (!isCorrectQueryType(queryType)) {
    throw new DreamstateError(EDreamstateErrorCode.INCORRECT_QUERY_TYPE, typeof queryType);
  }

  /*
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
    registry.QUERY_PROVIDERS_REGISTRY.set(queryType, [listener]);
  }

  /*
   * Return un-subscriber callback.
   */
  return function(): void {
    unRegisterQueryProvider(queryType, listener, registry);
  };
}
