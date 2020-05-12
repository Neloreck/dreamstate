import { IOptionalQueryRequest, TQueryResponse, TQueryType } from "../types";
import { CONTEXT_QUERY_METADATA_REGISTRY, CONTEXT_WORKERS_ACTIVATED, CONTEXT_WORKERS_REGISTRY } from "../internals";
import { promisifyQuery } from "./promisifyQuery";

export function queryMultiple<R>(
  queries: Array<IOptionalQueryRequest>
): Promise<Array<null | TQueryResponse<any>>> {
  const resolved: Array<Promise<null | TQueryResponse<any>>> = new Array(queries.length);

  for (const worker of CONTEXT_WORKERS_ACTIVATED) {
    if (CONTEXT_QUERY_METADATA_REGISTRY.has(worker) && CONTEXT_WORKERS_REGISTRY.has(worker)) {
      for (const [ method, type ] of CONTEXT_QUERY_METADATA_REGISTRY.get(worker)!) {
        for (let it = 0; it < queries.length; it ++) {
          if (queries[it].type === type && !resolved[it]) {
            resolved[it] = promisifyQuery(CONTEXT_WORKERS_REGISTRY.get(worker)!, method, queries[it]);
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
