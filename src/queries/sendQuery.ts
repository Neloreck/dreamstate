import { IQueryRequest, IQueryResponse, TQueryResponse, TQuerySubscriptionMetadata, TQueryType } from "../types";
import { CONTEXT_MANAGERS_REGISTRY, CONTEXT_QUERY_METADATA_REGISTRY } from "../internals";
import { ContextManager } from "../management";

import { log } from "../../build/macroses/log.macro";

/**
 * Find correct async listener and send response or null.
 * Try to find matching type and call related method.
 */
export function sendQuery<R, D = undefined, T extends TQueryType = TQueryType>(
  query: IQueryRequest<D, T>,
  senderId: symbol
): Promise<TQueryResponse<R, T> | null> {
  return new Promise(
    function (resolve: (response: IQueryResponse<R, T> | null) => void , reject: (error: Error) => void): any {
      const managersIDs: Array<symbol> = Object.getOwnPropertySymbols(CONTEXT_MANAGERS_REGISTRY);

      log.info("Possible query resolvers:", managersIDs.length);
      // Search each context manager metadata.
      for (let it = 0; it < managersIDs.length; it ++) {
        const managerId: symbol = managersIDs[it];

        // Skip own metadata checking.
        if ((managerId as unknown) === senderId) {
          continue;
        }

        log.info("Checking metadata for:", managerId, query);
        const managerMeta: TQuerySubscriptionMetadata = CONTEXT_QUERY_METADATA_REGISTRY[managerId as any];

        for (let jt = 0; jt < managerMeta.length; jt ++) {
          if (managerMeta[jt][1] === query.type) {
            const answerer: ContextManager<any> = CONTEXT_MANAGERS_REGISTRY[managerId as any];

            log.info(
              "Query resolver was found, triggering callback:",
              senderId,
              query,
              "=>",
              answerer.constructor.name, managerMeta[jt][0]
            );

            /**
             * Promisify query handler.
             * If it is async, add then and catch handlers then.
             * If it is sync - return value or reject on catch.
             */
            try {
              const result: any = (answerer as any)[managerMeta[jt][0]](query);

              if (result instanceof Promise) {
                return result
                  .then(function (data: any): void { resolve({ answerer, type: query.type, data }); })
                  .catch(reject);
              } else {
                return resolve({ answerer, type: query.type, data: result });
              }
            } catch (error) {
              reject(error);
            }
          } else {
            log.info("Skipping query resolver match:", managerId, managerMeta[jt]);
          }
        }
      }

      log.info("Query resolver was not found, returning null:", senderId, query);
      return resolve(null);
    }
  );
}
