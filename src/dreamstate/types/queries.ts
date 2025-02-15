import { TAnyValue } from "@/dreamstate/types/general";
import { TAnyContextManagerConstructor } from "@/dreamstate/types/internal";

/**
 * Represents allowed query types.
 * A query type can be a symbol, string, number, or any custom type that extends string.
 */
export type TQueryType<T extends string = string> = symbol | string | number | T;

/**
 * A base query request that includes an optional data field.
 * Represents a query with a key type and optional associated data.
 */
export interface IOptionalQueryRequest<D = TAnyValue, T extends TQueryType = TQueryType> {
  /**
   * The query key type used for search matching.
   */
  readonly type: T;
  /**
   * The data parameters requested by the query, optional.
   */
  readonly data?: D;
}

/**
 * A base query request with a required data field.
 * Represents a query with a key type and required data.
 */
export interface IQueryRequest<D = undefined, T extends TQueryType = TQueryType> {
  /**
   * The query key type used for search matching.
   */
  readonly type: T;
  /**
   * The data parameters requested by the query, required.
   */
  readonly data: D;
}

/**
 * A query request type that contains base information.
 * A type alias for IQueryRequest, defining a query with required data and key type.
 */
export type TQueryRequest<D = undefined, T extends TQueryType = TQueryType> = IQueryRequest<D, T>;

/**
 * Metadata for a query subscription.
 * An array of tuples containing a string or symbol and a query type.
 */
export type TQuerySubscriptionMetadata = Array<[string | symbol, TQueryType]>;

/**
 * A query listener that provides data for specific query types.
 * It takes a query request and returns the response data or null if no data is available.
 */
export type TQueryListener<T extends TQueryType = TQueryType, D = undefined, R = TAnyValue> = (
  query: IQueryRequest<D, T> | IOptionalQueryRequest<D, T>
) => R | null;

/**
 * A query response that represents the answer to a query request.
 * Contains the query key, data, timestamp, and the answerer that provided the response.
 */
export interface IQueryResponse<D = undefined, T extends TQueryType = TQueryType> {
  /**
   * The query key type used for search matching.
   */
  readonly type: T;
  /**
   * The data returned in response to the query request.
   */
  readonly data: D;
  /**
   * The timestamp when the query response was emitted.
   */
  readonly timestamp: number;
  /**
   * The answerer of the query, which can be a context manager constructor or a function returning data.
   */
  readonly answerer: TAnyContextManagerConstructor | (() => TAnyValue);
}

/**
 * A query response type.
 * A type alias for IQueryResponse, representing response without data.
 */
export type TQueryResponse<D = undefined> = IQueryResponse<D>;

/**
 * An optional query response type.
 * A query response that can either contain data or be null if no response is available.
 */
export type TOptionalQueryResponse<D = undefined> = IQueryResponse<D> | null;
