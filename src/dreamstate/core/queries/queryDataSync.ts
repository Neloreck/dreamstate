import { querySingleSync } from "@/dreamstate/core/queries/querySingleSync";
import { IOptionalQueryRequest, IQueryRequest, TQueryResponse, TQueryType } from "@/dreamstate/types";

/**
 * Find correct listener and return response or null.
 * Try to find matching type and call related method.
 * Returns everything as sync result, promises should be handled differently in this case.
 */
export function queryDataSync<
  R,
  D extends any,
  T extends TQueryType,
  Q extends IOptionalQueryRequest<D, T>
>(
  queries: Q
): TQueryResponse<R, T> {
  if (!queries || !(queries as IQueryRequest<D, T>).type) {
    throw new TypeError("Query must be an object with declared type or array of objects with type.");
  }

  return (querySingleSync(queries as IQueryRequest<D, T>) as any);
}
