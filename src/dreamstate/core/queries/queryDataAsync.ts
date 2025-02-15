import { DreamstateError } from "@/dreamstate/core/error/DreamstateError";
import { QUERY_METADATA_SYMBOL } from "@/dreamstate/core/internals";
import { IRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";
import {
  EDreamstateErrorCode,
  IOptionalQueryRequest,
  IQueryRequest,
  IQueryResponse,
  TAnyCallable,
  TAnyContextManagerConstructor,
  TQueryListener,
  TQueryResponse,
  TQueryType,
} from "@/dreamstate/types";

/**
 * Promisifies a query handler by wrapping it in a `Promise`.
 *
 * This function takes a query handler, and if it's asynchronous, it adds `.then` and `.catch` handlers to it.
 * If the query handler is synchronous, it directly returns the result or rejects the promise in case of an error.
 * It is useful for handling queries that may either return a promise or a direct result, ensuring consistent
 * promise-based handling.
 *
 * @template R - The type of the response expected from the query handler.
 * @template D - The type of data associated with the query request (optional).
 * @template T - The type of the query (defaults to `TQueryType`).
 * @param {TQueryListener<T, D, R>} callback - The query handler function that is called when the query is executed.
 *   It can either be synchronous or asynchronous.
 * @param {IOptionalQueryRequest<D, T>} query - The query request containing necessary data for the query.
 * @param {TAnyContextManagerConstructor | null} answerer - The context manager class reference
 *   that is handling the query.
 * @returns {Promise<TQueryResponse<R>>} A promise that resolves with the query response, either from the
 *   synchronous result or the asynchronous operation.
 */
function promisifyQuery<R, D = undefined, T extends TQueryType = TQueryType>(
  callback: TQueryListener<T, D, R>,
  query: IOptionalQueryRequest<D, T>,
  answerer: TAnyContextManagerConstructor | null
): Promise<TQueryResponse<R>> {
  return new Promise(function(resolve: (response: IQueryResponse<R, T>) => void, reject: (error: unknown) => void) {
    try {
      const timestamp: number = Date.now();
      const result: any = callback(query);

      /*
       * Not all query responders are sync or async.
       * Here we expect it to be either sync or async and handle it in an async way.
       */
      if (result instanceof Promise) {
        return result
          .then(function(data: any): void {
            resolve({
              answerer: answerer || (callback as TAnyCallable),
              type: query.type,
              data,
              timestamp,
            });
          })
          .catch(reject);
      } else {
        return resolve({
          answerer: answerer || (callback as TAnyCallable),
          type: query.type,
          data: result,
          timestamp,
        });
      }
    } catch (error: unknown) {
      reject(error);
    }
  });
}

/**
 * Finds the correct asynchronous listener or an array of listeners and returns the promise response or null.
 *
 * This function searches for a matching async listener based on the provided query type. If a listener is found,
 * it invokes the corresponding method and returns the result as a promise. If no matching listener is found,
 * the function returns `null`. It is useful for handling queries that require asynchronous processing and
 * responding with a promise.
 *
 * @template R - The type of the response expected from the query.
 * @template D - The type of the data associated with the query request.
 * @template T - The type of the query.
 * @template Q - The type of the query request (extends `IOptionalQueryRequest<D, T>`).
 * @param {Q} query - The query request containing the necessary data for the query.
 * @param {IRegistry} registry - An object containing registries for `CONTEXT_INSTANCES_REGISTRY`
 *   and `QUERY_PROVIDERS_REGISTRY`, which store context instances and query providers for the respective queries.
 * @returns {Promise<TQueryResponse<R> | null>} A promise that resolves with the query response if a matching listener
 *   is found, or `null` if no listener matches the query type.
 */
export function queryDataAsync<R, D, T extends TQueryType, Q extends IOptionalQueryRequest<D, T>>(
  query: Q,
  { CONTEXT_INSTANCES_REGISTRY, QUERY_PROVIDERS_REGISTRY }: IRegistry
): Promise<TQueryResponse<R> | null> {
  if (!query || !(query as IQueryRequest<D, T>).type) {
    throw new DreamstateError(
      EDreamstateErrorCode.INCORRECT_PARAMETER,
      "Query must be an object with declared type or array of objects with type."
    );
  }

  /*
   * Managers classes are in priority over custom handlers.
   * Registered in order of creation.
   */
  for (const service of CONTEXT_INSTANCES_REGISTRY.values()) {
    for (const entry of service[QUERY_METADATA_SYMBOL]) {
      if (query.type === entry[1]) {
        const method: string | symbol = entry[0];

        return promisifyQuery(
          (service as any)[method].bind(service),
          query,
          service.constructor as TAnyContextManagerConstructor
        );
      }
    }
  }

  /*
   * From class providers fallback to manually listed query provider factories.
   */
  if (QUERY_PROVIDERS_REGISTRY.has(query.type)) {
    const handlerFunction: TQueryListener<T, D> = QUERY_PROVIDERS_REGISTRY.get(query.type)![0];

    return promisifyQuery(handlerFunction, query, null);
  }

  /*
   * Resolve null if nothing was found to handle request.
   */
  return Promise.resolve(null);
}
