import { IOptionalQueryRequest, TQueryResponse, TQueryType } from "../types";
import { CONTEXT_QUERY_METADATA_REGISTRY, CONTEXT_SERVICES_ACTIVATED, CONTEXT_SERVICES_REGISTRY } from "../internals";
import { promisifyQuery } from "./promisifyQuery";

import { debug } from "../../build/macroses/debug.macro";

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
  for (const service of CONTEXT_SERVICES_ACTIVATED) {
    if (CONTEXT_QUERY_METADATA_REGISTRY.has(service) && CONTEXT_SERVICES_REGISTRY.has(service)) {
      debug.info("Checking metadata for:", service.name, query);

      for (const [ method, type ] of CONTEXT_QUERY_METADATA_REGISTRY.get(service)!) {
        if (type === query.type) {
          return promisifyQuery(CONTEXT_SERVICES_REGISTRY.get(service)!, method, query);
        }
      }
    }
  }

  return Promise.resolve(null);
}
