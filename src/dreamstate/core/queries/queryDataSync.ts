import { QUERY_METADATA_SYMBOL } from "@/dreamstate/core/internals";
import { IRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import {
  IOptionalQueryRequest,
  IQueryRequest, TAnyCallable,
  TAnyContextManagerConstructor,
  TQueryListener,
  TQueryResponse,
  TQueryType
} from "@/dreamstate/types";

/**
 * Execute query and return result in a sync way.
 */
function executeQuerySync<
  R,
  D = undefined,
  T extends TQueryType = TQueryType
  >(
  callback: TQueryListener<T, D>,
  query: IOptionalQueryRequest<D, T>,
  answerer: TAnyContextManagerConstructor | null
): TQueryResponse<R, T> {
  return ({
    answerer: answerer || callback as TAnyCallable,
    type: query.type,
    data: callback(query),
    timestamp: Date.now()
  });
}

/**
 * Find correct listener and return response or null.
 * Try to find matching type and call related method.
 * Returns everything as sync result, promises should be handled differently in this case.
 */
export function queryDataSync<
  R,
  D extends any,
  T extends TQueryType,
  Q extends IOptionalQueryRequest<D, T>
>(
  query: Q,
  { CONTEXT_SERVICES_ACTIVATED, CONTEXT_SERVICES_REGISTRY, QUERY_PROVIDERS_REGISTRY }: IRegistry
): TQueryResponse<R, T> | null {
  if (!query || !(query as IQueryRequest<D, T>).type) {
    throw new TypeError("Query must be an object with declared type or array of objects with type.");
  }

  /**
   * Managers classes are in priority over custom handlers.
   * Registered in order of creation.
   */
  for (const service of CONTEXT_SERVICES_ACTIVATED) {
    /**
     * Only if service has related metadata.
     */
    if (service[QUERY_METADATA_SYMBOL]) {
      for (const [ method, type ] of service[QUERY_METADATA_SYMBOL]) {
        if (type === query.type) {
          const handlerService: ContextManager = CONTEXT_SERVICES_REGISTRY.get(service)!;

          return executeQuerySync(
            (handlerService as any)[method].bind(handlerService),
            query,
            handlerService.constructor as TAnyContextManagerConstructor
          );
        }
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
