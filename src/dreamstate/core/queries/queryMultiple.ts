import {
  CONTEXT_QUERY_METADATA_REGISTRY,
  CONTEXT_SERVICES_ACTIVATED,
  CONTEXT_SERVICES_REGISTRY
} from "@/dreamstate/core/internals";
import { promisifyQuery } from "@/dreamstate/core/queries/promisifyQuery";
import { IOptionalQueryRequest, TQueryResponse } from "@/dreamstate/types";

export function queryMultiple<R>(
  queries: Array<IOptionalQueryRequest>
): Promise<Array<null | TQueryResponse<any>>> {
  const resolved: Array<Promise<null | TQueryResponse<any>>> = new Array(queries.length);

  for (const service of CONTEXT_SERVICES_ACTIVATED) {
    if (CONTEXT_QUERY_METADATA_REGISTRY.has(service) && CONTEXT_SERVICES_REGISTRY.has(service)) {
      for (const [ method, type ] of CONTEXT_QUERY_METADATA_REGISTRY.get(service)!) {
        for (let it = 0; it < queries.length; it ++) {
          if (queries[it].type === type && !resolved[it]) {
            resolved[it] = promisifyQuery(CONTEXT_SERVICES_REGISTRY.get(service)!, method, queries[it]);
          }
        }
      }
    }
  }

  for (let it = 0; it < resolved.length; it ++) {
    resolved[it] = resolved[it] || Promise.resolve(null);
  }

  return Promise.all(resolved);
}
