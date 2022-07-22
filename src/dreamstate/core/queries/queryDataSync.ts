import { DreamstateError } from "@/dreamstate/core/error/DreamstateError";
import { QUERY_METADATA_SYMBOL } from "@/dreamstate/core/internals";
import { IRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";
import {
  EDreamstateErrorCode,
  IOptionalQueryRequest,
  IQueryRequest,
  TAnyCallable,
  TAnyContextManagerConstructor,
  TQueryListener,
  TQueryResponse,
  TQueryType
} from "@/dreamstate/types";

/**
 * Execute query and return result in a sync way.
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
    timestamp: Date.now()
  };
}

/**
 * Find correct listener and return response or null.
 * Try to find matching type and call related method.
 * Returns everything as sync result, promises should be handled differently in this case.
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

  /**
   * Managers classes are in priority over custom handlers.
   * Registered in order of creation.
   */
  for (const service of CONTEXT_INSTANCES_REGISTRY.values()) {
    for (const entry of service[QUERY_METADATA_SYMBOL]) {
      if (query.type === entry[1]) {
        const method: string | symbol = entry[0];

        return executeQuerySync(
          (service as any)[method].bind(service),
          query,
          service.constructor as TAnyContextManagerConstructor
        );
      }
    }
  }

  /**
   * From class providers fallback to manually listed query provider factories.
   */
  if (QUERY_PROVIDERS_REGISTRY.has(query.type)) {
    const handlerFunction: TQueryListener<T, D> = QUERY_PROVIDERS_REGISTRY.get(query.type)![0];

    return executeQuerySync(handlerFunction, query, null);
  }

  return null;
}
