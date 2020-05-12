import { IOptionalQueryRequest, IQueryResponse, TDreamstateWorker, TQueryType } from "../types";
import { ContextWorker } from "../";

/**
 * Promisify query handler.
 * If it is async, add then and catch handlers.
 * If it is sync - return value or reject on catch.
 */
export function promisifyQuery<R, D = undefined, T extends TQueryType = TQueryType>(
  worker: ContextWorker,
  method: TQueryType,
  query: IOptionalQueryRequest<D, T>
) {
  return new Promise(function (
    resolve: (response: IQueryResponse<R, T> | null) => void,
    reject: (error: Error) => void
  ) {
    try {
      const timestamp: number = Date.now();
      const result: any = (worker as any)[method](query);

      if (result instanceof Promise) {
        return result
          .then(function (data: any): void {
            resolve({
              answerer: worker.constructor as TDreamstateWorker,
              type: query.type,
              data,
              timestamp
            });
          })
          .catch(reject);
      } else {
        return resolve({
          answerer: worker.constructor as TDreamstateWorker,
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
