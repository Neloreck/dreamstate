import {
  IQueryRequest,
  IQueryResponse,
  TDreamstateWorker,
  TQueryResponse,
  TQuerySubscriptionMetadata,
  TQueryType
} from "../types";
import { CONTEXT_WORKERS_ACTIVATED, CONTEXT_WORKERS_REGISTRY, CONTEXT_QUERY_METADATA_REGISTRY } from "../internals";
import { ContextWorker } from "../management/ContextWorker";

import { log } from "../../build/macroses/log.macro";

/**
 * Find correct async listener and send response or null.
 * Try to find matching type and call related method.
 */
export function sendQuery<R, D = undefined, T extends TQueryType = TQueryType>(
  query: IQueryRequest<D, T>,
  sender?: TDreamstateWorker
): Promise<TQueryResponse<R, T> | null> {
  // Validate query type.
  if (!query || !query.type) {
    throw new TypeError("Query must be an object with declared type.");
  }

  const timestamp: number = Date.now();

  log.info("Possible query resolvers:", CONTEXT_WORKERS_ACTIVATED.size);
  // Search each context worker metadata.
  for (const worker of CONTEXT_WORKERS_ACTIVATED) {
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
          sender && sender.name,
          query,
          "=>",
          worker.name,
          workerMeta[jt][0]
        );

        const answerer: ContextWorker = CONTEXT_WORKERS_REGISTRY.get(worker)!;

        return new Promise(function (
          resolve: (response: IQueryResponse<R, T> | null) => void,
          reject: (error: Error) => void
        ): any {
          /**
           * Promisify query handler.
           * If it is async, add then and catch handlers.
           * If it is sync - return value or reject on catch.
           */
          try {
            const result: any = (answerer as any)[workerMeta[jt][0]](query);

            if (result instanceof Promise) {
              return result
                .then(function (data: any): void {
                  resolve({ answerer: worker, type: query.type, data, timestamp });
                })
                .catch(reject);
            } else {
              return resolve({ answerer: worker, type: query.type, data: result, timestamp });
            }
          } catch (error) {
            reject(error);
          }
        });
      }
    }
  }

  log.info("Query resolver was not found, returning null:", sender && sender.name, query);

  return Promise.resolve(null);
}
