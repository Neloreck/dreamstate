import { QUERY_METADATA_SYMBOL } from "@/dreamstate/core/internals";
import { IRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";
import {
  IOptionalQueryRequest,
  IQueryRequest,
  IQueryResponse,
  TAnyCallable,
  TAnyContextManagerConstructor,
  TQueryListener,
  TQueryResponse,
  TQueryType
} from "@/dreamstate/types";

/**
 * Promisify query handler.
 * If it is async, add then and catch handlers.
 * If it is sync - return value or reject on catch.
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

      /**
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
              timestamp
            });
          })
          .catch(reject);
      } else {
        return resolve({
          answerer: answerer || (callback as TAnyCallable),
          type: query.type,
          data: result,
          timestamp
        });
      }
    } catch (error: unknown) {
      reject(error);
    }
  });
}

/**
 * Find correct async listener or array of listeners and return Promise response or null.
 * Try to find matching type and call related method.
 */
export function queryDataAsync<R, D, T extends TQueryType, Q extends IOptionalQueryRequest<D, T>>(
  query: Q,
  { CONTEXT_INSTANCES_REGISTRY, QUERY_PROVIDERS_REGISTRY }: IRegistry
): Promise<TQueryResponse<R> | null> {
  if (!query || !(query as IQueryRequest<D, T>).type) {
    throw new TypeError("Query must be an object with declared type or array of objects with type.");
  }

  /**
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

  /**
   * From class providers fallback to manually listed query provider factories.
   */
  if (QUERY_PROVIDERS_REGISTRY.has(query.type)) {
    const handlerFunction: TQueryListener<T, D> = QUERY_PROVIDERS_REGISTRY.get(query.type)![0];

    return promisifyQuery(handlerFunction, query, null);
  }

  /**
   * Resolve null if nothing was found to handle request.
   */
  return Promise.resolve(null);
}
