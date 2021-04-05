import {
  IOptionalQueryRequest,
  TAnyCallable,
  TAnyContextServiceConstructor,
  TQueryListener,
  TQueryType
} from "@/dreamstate/types";

/**
 * Execute query and return result in a sync way.
 */
export function executeQuerySync<
  R,
  D = undefined,
  T extends TQueryType = TQueryType
>(
  callback: TQueryListener<T, D>,
  query: IOptionalQueryRequest<D, T>,
  answerer: TAnyContextServiceConstructor | null
) {
  return ({
    answerer: answerer || callback as TAnyCallable,
    type: query.type,
    data: callback(query),
    timestamp: Date.now()
  });
}
