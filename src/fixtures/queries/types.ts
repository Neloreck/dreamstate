import { TQueryRequest } from "@/dreamstate/types";
import { EQuery } from "@/fixtures/queries/EQuery";

export type TAsyncNumberQuery = TQueryRequest<void, EQuery.ASYNC_NUMBER_QUERY>;

export type TAsyncStringQuery = TQueryRequest<string, EQuery.ASYNC_STRING_QUERY>;

export type TSyncBooleanQuery = TQueryRequest<void, EQuery.SYNC_BOOLEAN_QUERY>;

export type TAsyncExceptionQuery = TQueryRequest<void, EQuery.ASYNC_EXCEPTION_QUERY>;

export type TSyncExceptionQuery = TQueryRequest<void, EQuery.SYNC_EXCEPTION_QUERY>;
