import { ContextService } from "@/dreamstate/core/services/ContextService";
import { IOptionalQueryRequest, IQueryResponse, TDreamstateService, TQueryType } from "@/dreamstate/types";

/**
 * Promisify query handler.
 * If it is async, add then and catch handlers.
 * If it is sync - return value or reject on catch.
 */
export function promisifyQuery<R, D = undefined, T extends TQueryType = TQueryType>(
  service: ContextService,
  method: TQueryType,
  query: IOptionalQueryRequest<D, T>
) {
  return new Promise(function(
    resolve: (response: IQueryResponse<R, T> | null) => void,
    reject: (error: Error) => void
  ) {
    try {
      const timestamp: number = Date.now();
      const result: any = (service as any)[method](query);

      if (result instanceof Promise) {
        return result
          .then(function(data: any): void {
            resolve({
              answerer: service.constructor as TDreamstateService,
              type: query.type,
              data,
              timestamp
            });
          })
          .catch(reject);
      } else {
        return resolve({
          answerer: service.constructor as TDreamstateService,
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
