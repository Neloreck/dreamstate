import { TAnyContextManagerConstructor } from "@/dreamstate/types/internal";

/**
 * Allowed query types.
 */
export type TQueryType<T extends string = string> = symbol | string | number | T;

/**
 * Base query request with optional query field.
 */
export interface IOptionalQueryRequest<D = any, T extends TQueryType = TQueryType> {
  /**
   * Query key type for search matching.
   */
  readonly type: T;
  /**
   * Query requested data params.
   */
  readonly data?: D;
}

/**
 * Base query request with optional supplied field.
 */
export interface IQueryRequest<D = undefined, T extends TQueryType = TQueryType> {
  /**
   * Query key type for search matching.
   */
  readonly type: T;
  /**
   * Query requested data params.
   */
  readonly data: D;
}

/**
 * Query request typing that contains base information.
 */
export type TQueryRequest<D = undefined, T extends TQueryType = TQueryType> = IQueryRequest<D, T>;

export type TQuerySubscriptionMetadata = Array<[string | symbol, TQueryType]>;

/**
 * Query responding listener that provides data for a specific query types.
 */
export type TQueryListener<T extends TQueryType = TQueryType, D = undefined, R = any> = (
  query: IQueryRequest<D, T> | IOptionalQueryRequest<D, T>
) => R | null;

/**
 * Query response that is composed as answer to query requests.
 */
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

export type TQueryResponse<D = undefined> = IQueryResponse<D>;

export type TOptionalQueryResponse<D = undefined> = null | IQueryResponse<D>;
