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
  TOptionalQueryResponse,
  TQueryListener,
  TQueryType
} from "@/dreamstate/types";

/**
 * Get single query resolver from possible metadata.
 */
export function querySingle<
  R extends any,
  D extends any,
  T extends TQueryType = TQueryType
>(
  query: IOptionalQueryRequest<D, T>
): Promise<TOptionalQueryResponse<R, T>> {
  for (const service of CONTEXT_SERVICES_ACTIVATED) {
    if (CONTEXT_QUERY_METADATA_REGISTRY.has(service) && CONTEXT_SERVICES_REGISTRY.has(service)) {
      for (const [ method, type ] of CONTEXT_QUERY_METADATA_REGISTRY.get(service)!) {
        if (type === query.type) {
          const handlerService: ContextManager = CONTEXT_SERVICES_REGISTRY.get(service)!;

          return promisifyQuery(
            (handlerService as any)[method].bind(handlerService),
            query,
            handlerService.constructor as TAnyContextManagerConstructor
          );
        }
      }
    }
  }

  /**
   * From class providers fallback to manually listed query provider factories.
   */
  if (QUERY_PROVIDERS_REGISTRY.has(query.type)) {
    const handlerFunction: TQueryListener<T, D> = QUERY_PROVIDERS_REGISTRY.get(query.type)![0];

    return promisifyQuery(handlerFunction, query, null);
  }

  return Promise.resolve(null);
}
