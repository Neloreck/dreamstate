import { TAnyContextManagerConstructor } from "@/dreamstate/types/internal";

export type TQueryType = symbol | string | number;

export interface IOptionalQueryRequest<D extends any = any, T extends TQueryType = TQueryType> {
  /**
   * Query key type for search matching.
   */
  readonly type: T;
  /**
   * Query requested data params.
   */
  readonly data?: D;
}

export interface IQueryRequest<D extends any = undefined, T extends TQueryType = TQueryType> {
  /**
   * Query key type for search matching.
   */
  readonly type: T;
  /**
   * Query requested data params.
   */
  readonly data: D;
}

export type TQueryRequest<D = undefined, T extends TQueryType = TQueryType> = IQueryRequest<D, T>;

export type TQuerySubscriptionMetadata = Array<[ string | symbol, TQueryType ]>;

export type TQueryListener<T extends TQueryType = TQueryType, D = undefined, R = any> =
  (query: IQueryRequest<D, T> | IOptionalQueryRequest<D, T>) => R | null;

export interface IQueryResponse<D = undefined, T extends TQueryType = TQueryType> {
  /**
   * Query key type for search matching.
   */
  readonly type: T;
  /**
   * Query requested data params.
   */
  readonly data: D;
  /**
   * Query emit timestamp.
   */
  readonly timestamp: number;
  /**
   * Query answerer.
   */
  readonly answerer: TAnyContextManagerConstructor | (() => any);
}

export type TQueryResponse<D = undefined, T extends TQueryType = TQueryType> = IQueryResponse<D, T>;

export type TOptionalQueryResponse<D = undefined, T extends TQueryType = TQueryType> = null | IQueryResponse<D, T>;
