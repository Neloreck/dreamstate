import {
  CONTEXT_QUERY_METADATA_REGISTRY,
  CONTEXT_SERVICES_ACTIVATED,
  CONTEXT_SERVICES_REGISTRY
} from "@/dreamstate/core/internals";
import { executeQuerySync } from "@/dreamstate/core/queries/executeQuerySync";
import { IOptionalQueryRequest, TOptionalQueryResponse, TQueryType } from "@/dreamstate/types";

/**
 * Get single query resolver from possible metadata.
 */
export function querySingleSync<
  R extends any,
  D extends any,
  T extends TQueryType = TQueryType
>(
  query: IOptionalQueryRequest<D, T>
): TOptionalQueryResponse<R, T> {
  for (const service of CONTEXT_SERVICES_ACTIVATED) {
    if (CONTEXT_QUERY_METADATA_REGISTRY.has(service) && CONTEXT_SERVICES_REGISTRY.has(service)) {
      for (const [ method, type ] of CONTEXT_QUERY_METADATA_REGISTRY.get(service)!) {
        if (type === query.type) {
          return executeQuerySync(CONTEXT_SERVICES_REGISTRY.get(service)!, method, query);
        }
      }
    }
  }

  return null;
}
