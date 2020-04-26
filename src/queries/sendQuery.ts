import {
  IQueryRequest,
  IQueryResponse,
  TDreamstateWorker,
  TQueryResponse,
  TQuerySubscriptionMetadata,
  TQueryType
} from "../types";
import { CONTEXT_WORKERS_ACTIVATED, CONTEXT_WORKERS_REGISTRY, CONTEXT_QUERY_METADATA_REGISTRY } from "../internals";
import { ContextWorker } from "../management";

import { log } from "../../build/macroses/log.macro";

/**
 * Find correct async listener and send response or null.
 * Try to find matching type and call related method.
 */
export function sendQuery<R, D = undefined, T extends TQueryType = TQueryType>(
  query: IQueryRequest<D, T>,
  sender: TDreamstateWorker
): Promise<TQueryResponse<R, T> | null> {
  return new Promise(function (
    resolve: (response: IQueryResponse<R, T> | null) => void,
    reject: (error: Error) => void
  ): any {
    const workers: Set<TDreamstateWorker> = CONTEXT_WORKERS_ACTIVATED;

    log.info("Possible query resolvers:", workers.size);
    // Search each context manager metadata.
    for (const worker of workers) {
      // Skip own metadata checking.
      // Skip workers without metadata.
      // Skip non-instantiated workers.
      if (
        worker === sender ||
        !CONTEXT_QUERY_METADATA_REGISTRY.has(worker) ||
        !CONTEXT_WORKERS_REGISTRY.has(worker)
      ) {
        continue;
      }

      log.info("Checking metadata for:", worker.name, query);

      const workerMeta: TQuerySubscriptionMetadata = CONTEXT_QUERY_METADATA_REGISTRY.get(worker)!;

      for (let jt = 0; jt < workerMeta.length; jt ++) {
        if (workerMeta[jt][1] === query.type) {
          log.info(
            "Query resolver was found, triggering callback:",
            sender.name,
            query,
            "=>",
            worker.name,
            workerMeta[jt][0]
          );

          const answerer: ContextWorker = CONTEXT_WORKERS_REGISTRY.get(worker)!;

          /**
           * Promisify query handler.
           * If it is async, add then and catch handlers then.
           * If it is sync - return value or reject on catch.
           */
          try {
            const result: any = (answerer as any)[workerMeta[jt][0]](query);

            if (result instanceof Promise) {
              return result
                .then(function (data: any): void {
                  resolve({ answerer: worker, type: query.type, data });
                })
                .catch(reject);
            } else {
              return resolve({ answerer: worker, type: query.type, data: result });
            }
          } catch (error) {
            reject(error);
          }
        } else {
          log.info("Skipping query resolver match:", worker.name, workerMeta[jt]);
        }
      }
    }

    log.info("Query resolver was not found, returning null:", sender.name, query);

    return resolve(null);
  });
}
