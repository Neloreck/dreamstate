import { OnQuery } from "@/dreamstate/core/queries/OnQuery";
import { ContextService } from "@/dreamstate/core/services/ContextService";
import { TQueryRequest, TQueryResponse } from "@/dreamstate/types";

export enum EQuery {
  SYNC_BOOLEAN_QUERY = "SYNC_BOOLEAN_QUERY",
  ASYNC_NUMBER_QUERY = "ASYNC_NUMBER_QUERY",
  ASYNC_STRING_QUERY = "ASYNC_STRING_QUERY",
  SYNC_EXCEPTION_QUERY = "SYNC_EXCEPTION_QUERY",
  ASYNC_EXCEPTION_QUERY = "ASYNC_EXCEPTION_QUERY",
  UNDEFINED_QUERY = "UNDEFINED_QUERY"
}

export type TAsyncNumberQuery = TQueryRequest<void, EQuery.ASYNC_NUMBER_QUERY>;
export type TAsyncStringQuery = TQueryRequest<string, EQuery.ASYNC_STRING_QUERY>;
export type TSyncBooleanQuery = TQueryRequest<void, EQuery.SYNC_BOOLEAN_QUERY>;
export type TAsyncExceptionQuery = TQueryRequest<void, EQuery.ASYNC_EXCEPTION_QUERY>;
export type TSyncExceptionQuery = TQueryRequest<void, EQuery.SYNC_EXCEPTION_QUERY>;

export class RespondingService extends ContextService {

  @OnQuery(EQuery.ASYNC_EXCEPTION_QUERY)
  public async onAsyncExceptionQuery(queryRequest: TAsyncExceptionQuery): Promise<never> {
    throw new Error();
  }

  @OnQuery(EQuery.SYNC_EXCEPTION_QUERY)
  public onSyncExceptionQuery(queryRequest: TSyncExceptionQuery): never {
    throw new Error();
  }

  @OnQuery(EQuery.SYNC_BOOLEAN_QUERY)
  public onSyncBooleanQuery(queryRequest: TSyncBooleanQuery): boolean {
    return true;
  }

  @OnQuery(EQuery.ASYNC_NUMBER_QUERY)
  public async onAsyncNumberQuery(queryRequest: TAsyncNumberQuery): Promise<number> {
    return 100;
  }

  @OnQuery(EQuery.ASYNC_STRING_QUERY)
  public async onAsyncStringQuery(queryRequest: TAsyncStringQuery): Promise<string> {
    return queryRequest.data;
  }

}

export class RespondingDuplicateService extends ContextService {

  @OnQuery(EQuery.ASYNC_NUMBER_QUERY)
  public async onAsyncNumberQuery(queryRequest: TAsyncNumberQuery): Promise<number> {
    return -1;
  }

}

export class RequestingService extends ContextService {

  public async queryUndefinedData(): Promise<TQueryResponse<any>> {
    return this.queryData({ type: EQuery.UNDEFINED_QUERY });
  }

  public async querySyncThrowingData(): Promise<TQueryResponse<void>> {
    return this.queryData({ type: EQuery.SYNC_EXCEPTION_QUERY });
  }

  public async querySyncBooleanData(): Promise<TQueryResponse<boolean>> {
    return this.queryData({ type: EQuery.SYNC_BOOLEAN_QUERY });
  }

  public async queryAsyncThrowingData(): Promise<TQueryResponse<void>> {
    return this.queryData({ type: EQuery.ASYNC_EXCEPTION_QUERY });
  }

  public async queryAsyncNumberData(): Promise<TQueryResponse<number>> {
    return this.queryData({ type: EQuery.ASYNC_NUMBER_QUERY });
  }

  public async queryAsyncStringData(data: string): Promise<TQueryResponse<string>> {
    return this.queryData({ type: EQuery.ASYNC_STRING_QUERY, data });
  }

}
