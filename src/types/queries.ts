import type { ContextManager } from "../management";

export type TQueryType = symbol | string | number;

export interface IQueryRequest<D = undefined, T extends TQueryType = TQueryType> {
  /**
   * Query key type for search matching.
   */
  type: T;
  /**
   * Query requested data params.
   */
  data: D;
}

export type TQueryRequest<D = undefined, T extends TQueryType = TQueryType> = IQueryRequest<D, T>;

export type TQuerySubscriptionMetadata = Array<[ string | symbol, TQueryType ]>;

export interface IQueryResponse<D = undefined, T extends TQueryType = TQueryType> {
  type: T;
  data: D;
  answerer: ContextManager<any>;
}

export type TQueryResponse<D = undefined, T extends TQueryType = TQueryType> = null | IQueryResponse<D, T>;
