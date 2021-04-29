import {
  IOptionalQueryRequest,
  IQueryResponse,
  TAnyCallable,
  TAnyContextManagerConstructor, TQueryListener,
  TQueryType
} from "@/dreamstate/types";

/**
 * Promisify query handler.
 * If it is async, add then and catch handlers.
 * If it is sync - return value or reject on catch.
 */
export function promisifyQuery<
  R,
  D = undefined,
  T extends TQueryType = TQueryType
>(
  callback: TQueryListener<T, D, R>,
  query: IOptionalQueryRequest<D, T>,
  answerer: TAnyContextManagerConstructor | null
) {
  return new Promise(function(
    resolve: (response: IQueryResponse<R, T> | null) => void,
    reject: (error: Error) => void
  ) {
    try {
      const timestamp: number = Date.now();
      const result: any = callback(query);

      if (result instanceof Promise) {
        return result
          .then(function(data: any): void {
            resolve({
              answerer: answerer || callback as TAnyCallable,
              type: query.type,
              data,
              timestamp
            });
          })
          .catch(reject);
      } else {
        return resolve({
          answerer: answerer || callback as TAnyCallable,
          type: query.type,
          data: result,
          timestamp
        });
      }
    } catch (error) {
      reject(error);
    }
  });
}
