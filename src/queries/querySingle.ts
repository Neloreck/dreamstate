import { IOptionalQueryRequest, TQueryResponse, TQueryType } from "../types";
import { CONTEXT_QUERY_METADATA_REGISTRY, CONTEXT_WORKERS_ACTIVATED, CONTEXT_WORKERS_REGISTRY } from "../internals";
import { promisifyQuery } from "./promisifyQuery";

import { log } from "../../build/macroses/log.macro";

/**
 * Get single query resolver from possible metadata.
 */
export function querySingle<
  R extends any,
  D extends any,
  T extends TQueryType = TQueryType
>(
  query: IOptionalQueryRequest<D, T>
): Promise<TQueryResponse<R, T>> {
  for (const worker of CONTEXT_WORKERS_ACTIVATED) {
    if (CONTEXT_QUERY_METADATA_REGISTRY.has(worker) && CONTEXT_WORKERS_REGISTRY.has(worker)) {
      log.info("Checking metadata for:", worker.name, query);

      for (const [ method, type ] of CONTEXT_QUERY_METADATA_REGISTRY.get(worker)!) {
        if (type === query.type) {
          return promisifyQuery(CONTEXT_WORKERS_REGISTRY.get(worker)!, method, query);
        }
      }
    }
  }

  return Promise.resolve(null);
}
