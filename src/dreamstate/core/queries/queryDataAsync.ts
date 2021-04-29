import { querySingle } from "@/dreamstate/core/queries/querySingle";
import { IOptionalQueryRequest, IQueryRequest, TQueryResponse, TQueryType } from "@/dreamstate/types";

/**
 * Find correct async listener or array of listeners and return response or null.
 * Try to find matching type and call related method.
 */
export function queryDataAsync<
  R,
  D extends any,
  T extends TQueryType,
  Q extends IOptionalQueryRequest<D, T>
>(
  query: Q
): Promise<TQueryResponse<R, T>> {
  if (!query || !(query as IQueryRequest<D, T>).type) {
    throw new TypeError("Query must be an object with declared type or array of objects with type.");
  }

  return querySingle(query as IQueryRequest<D, T>) as any;
}
