import {
  CONTEXT_QUERY_METADATA_REGISTRY,
  CONTEXT_SERVICES_ACTIVATED,
  CONTEXT_SERVICES_REGISTRY,
  QUERY_PROVIDERS_REGISTRY
} from "@/dreamstate/core/internals";
import { promisifyQuery } from "@/dreamstate/core/queries/promisifyQuery";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import {
  IOptionalQueryRequest,
  TAnyContextManagerConstructor,
  TQueryListener,
  TQueryResponse
} from "@/dreamstate/types";

export function queryMultiple<R>(
  queries: Array<IOptionalQueryRequest>
): Promise<Array<null | TQueryResponse<any>>> {
  const resolved: Array<Promise<null | TQueryResponse<any>>> = new Array(queries.length);

  for (const service of CONTEXT_SERVICES_ACTIVATED) {
    if (CONTEXT_QUERY_METADATA_REGISTRY.has(service) && CONTEXT_SERVICES_REGISTRY.has(service)) {
      for (const [ method, type ] of CONTEXT_QUERY_METADATA_REGISTRY.get(service)!) {
        for (let it = 0; it < queries.length; it ++) {
          if (queries[it].type === type && !resolved[it]) {
            const handlerService: ContextManager = CONTEXT_SERVICES_REGISTRY.get(service)!;

            resolved[it] = promisifyQuery(
              (handlerService as any)[method].bind(handlerService),
              queries[it],
              handlerService.constructor as TAnyContextManagerConstructor
            );
          }
        }
      }
    }
  }

  for (let it = 0; it < resolved.length; it ++) {
    if (!resolved[it]) {
      if (QUERY_PROVIDERS_REGISTRY.has(queries[it].type)) {
        const handlerFunction: TQueryListener<any, any> = QUERY_PROVIDERS_REGISTRY.get(queries[it].type)![0];

        resolved[it] = promisifyQuery(handlerFunction, queries[it], null);
      } else {
        resolved[it] = Promise.resolve(null);
      }
    }

    resolved[it] = resolved[it] || Promise.resolve(null);
  }

  return Promise.all(resolved);
}
