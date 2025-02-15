import { DreamstateError } from "@/dreamstate/core/error/DreamstateError";
import { QUERY_METADATA_SYMBOL } from "@/dreamstate/core/internals";
import { IRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";
import {
  EDreamstateErrorCode,
  IOptionalQueryRequest,
  IQueryRequest,
  TAnyCallable,
  TAnyContextManagerConstructor,
  TAnyValue,
  TQueryListener,
  TQueryResponse,
  TQueryType,
} from "@/dreamstate/types";

/**
 * Executes a query and returns the result synchronously.
 *
 * This function processes the query using the provided query handler and returns the result directly.
 * It is designed for cases where the query handler is synchronous and can immediately return a response.
 * If the query handler is asynchronous, this function will not wait for the result and return raw promise response.
 *
 * @template R - The type of the response expected from the query handler.
 * @template D - The type of the data associated with the query request (optional).
 * @template T - The type of the query (defaults to `TQueryType`).
 * @param {TQueryListener<T, D>} callback - The query handler function that is called with the query and
 *   should return a result synchronously.
 * @param {IOptionalQueryRequest<D, T>} query - The query request containing necessary data for the query.
 * @param {TAnyContextManagerConstructor | null} answerer - The context manager class reference
 *   responsible for handling the query.
 * @returns {TQueryResponse<R>} The result of the query execution, returned synchronously.
 */
function executeQuerySync<R, D = undefined, T extends TQueryType = TQueryType>(
  callback: TQueryListener<T, D>,
  query: IOptionalQueryRequest<D, T>,
  answerer: TAnyContextManagerConstructor | null
): TQueryResponse<R> {
  return {
    answerer: answerer || (callback as TAnyCallable),
    type: query.type,
    data: callback(query),
    timestamp: Date.now(),
  };
}

/**
 * Finds the correct listener and returns the response synchronously, or `null` if no matching listener is found.
 *
 * This function searches for a matching listener based on the provided query type and invokes the corresponding
 * method. It is designed for handling synchronous queries. The function will return the result directly.
 *
 * @template R - The type of the response expected from the query.
 * @template D - The type of the data associated with the query request.
 * @template T - The type of the query.
 * @template Q - The type of the query request (extends `IOptionalQueryRequest<D, T>`).
 * @param {Q} query - The query request containing the necessary data for the query.
 * @param {IRegistry} registry - The registry object to execute query in.
 * @returns {TQueryResponse<R> | null} The result of the query if a matching listener is found,
 *   or `null` if no matching listener exists.
 */
export function queryDataSync<R, D, T extends TQueryType, Q extends IOptionalQueryRequest<D, T>>(
  query: Q,
  { CONTEXT_INSTANCES_REGISTRY, QUERY_PROVIDERS_REGISTRY }: IRegistry
): TQueryResponse<R> | null {
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

        return executeQuerySync(
          (service as TAnyValue)[method].bind(service),
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

    return executeQuerySync(handlerFunction, query, null);
  }

  return null;
}
