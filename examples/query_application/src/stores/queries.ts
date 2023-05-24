import { QueryResponse } from "dreamstate";

/**
 * Make sure query values are unique.
 * Normally it should work under the scope, but in case of heavy cross-app usage prefixes may be needed.
 */
export enum EGenericQuery {
  SAMPLE_NUMBER = "SAMPLE_NUMBER_CHANGED",
  STRING_FROM_COMPONENT = "STRING_FROM_COMPONENT"
}

/**
 * Query response type for each type.
 * Marking that 'data' field will contain number value.
 */
export type TSampleNumberQueryResponse = QueryResponse<number>;

export type TStringFromComponentQueryResponse = QueryResponse<string>;
