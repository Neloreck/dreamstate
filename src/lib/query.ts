import {
  IQueryRequest, IQueryResponse,
  TAnyContextManagerConstructor,
  TQueryResponse, TQuerySubscriptionMetadata,
  TQueryType,
} from "./types";
import {
  CONTEXT_MANAGERS_REGISTRY,
  CONTEXT_QUERY_METADATA_REGISTRY,
  IDENTIFIER_KEY
} from "./internals";
import { ContextManager } from "./management";

import { log } from "../macroses/log.macro";
import { createMethodDecorator } from "./polyfills/decorate";

/**
 * Find correct async listener and send response or null.
 * Try to find matching type and call related method.
 */
export function sendQuery<R, D = undefined, T extends TQueryType = TQueryType>(
  query: IQueryRequest<D, T>,
  senderId: symbol
): Promise<TQueryResponse<R, T> | null> {
  return new Promise(
    function (resolve: (response: IQueryResponse<R, T> | null) => void , reject: (error: Error) => void): void {
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

            return (answerer as any)[managerMeta[jt][0]](query)
              .then(function (data: any): void {
                resolve({ answerer, type: query.type, data });
              })
              .catch(reject);
          } else {
            log.info("Skipping query resolver match:", managerId, managerMeta[jt]);
          }
        }
      }

      log.info("Query resolver was not found, returning null:", senderId, query);
      resolve(null);
    }
  );
}

export function OnQuery(queryType: TQueryType): MethodDecorator {
  return createMethodDecorator<TAnyContextManagerConstructor>(function rememberMethodQuery(
    method: string | symbol,
    managerConstructor: TAnyContextManagerConstructor
  ): void {
    log.info("Query metadata written for context manager:", managerConstructor.name, queryType, method);

    CONTEXT_QUERY_METADATA_REGISTRY[managerConstructor[IDENTIFIER_KEY]].push([ method, queryType ]);
  });
}
