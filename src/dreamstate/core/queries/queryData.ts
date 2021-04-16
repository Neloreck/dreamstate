import { queryMultiple } from "@/dreamstate/core/queries/queryMultiple";
import { querySingle } from "@/dreamstate/core/queries/querySingle";
import { IOptionalQueryRequest, IQueryRequest, TQueryResponse, TQueryType } from "@/dreamstate/types";

/**
 * Find correct async listener or array of listeners and return response or null.
 * Try to find matching type and call related method.
 *
 * @deprecated multiple queries at once, only one query per call will remain
 */
export function queryData<
  R,
  D extends any,
  T extends TQueryType,
  Q extends IOptionalQueryRequest<D, T> | Array<IOptionalQueryRequest>
>(
  queries: Q
): Q extends Array<any> ? Promise<Array<TQueryResponse<any, T>>> : Promise<TQueryResponse<R, T>> {
  if (Array.isArray(queries)) {
    for (const query of queries) {
      if (!query || !query.type) {
        throw new TypeError("Query must be an object with declared type or array of objects with type.");
      }
    }
  } else if (!queries || !(queries as IQueryRequest<D, T>).type) {
    throw new TypeError("Query must be an object with declared type or array of objects with type.");
  }

  return Array.isArray(queries) ? queryMultiple(queries) : (querySingle(queries as IQueryRequest<D, T>) as any);
}
