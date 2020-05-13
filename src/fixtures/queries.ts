import { ContextService, OnQuery, QueryRequest, QueryResponse } from "../index";

export enum EQuery {
  SYNC_BOOLEAN_QUERY = "SYNC_BOOLEAN_QUERY",
  ASYNC_NUMBER_QUERY = "ASYNC_NUMBER_QUERY",
  ASYNC_STRING_QUERY = "ASYNC_STRING_QUERY",
  SYNC_EXCEPTION_QUERY = "SYNC_EXCEPTION_QUERY",
  ASYNC_EXCEPTION_QUERY = "ASYNC_EXCEPTION_QUERY",
  UNDEFINED_QUERY = "UNDEFINED_QUERY"
}

export type TAsyncNumberQuery = QueryRequest<void, EQuery.ASYNC_NUMBER_QUERY>;
export type TAsyncStringQuery = QueryRequest<string, EQuery.ASYNC_STRING_QUERY>;
export type TSyncBooleanQuery = QueryRequest<void, EQuery.SYNC_BOOLEAN_QUERY>;
export type TAsyncExceptionQuery = QueryRequest<void, EQuery.ASYNC_EXCEPTION_QUERY>;
export type TSyncExceptionQuery = QueryRequest<void, EQuery.SYNC_EXCEPTION_QUERY>;

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

  public async queryUndefinedData(): Promise<QueryResponse<any>> {
    return this.queryData({ type: EQuery.UNDEFINED_QUERY });
  }

  public async querySyncThrowingData(): Promise<QueryResponse<void>> {
    return this.queryData({ type: EQuery.SYNC_EXCEPTION_QUERY });
  }

  public async querySyncBooleanData(): Promise<QueryResponse<boolean>> {
    return this.queryData({ type: EQuery.SYNC_BOOLEAN_QUERY });
  }

  public async queryAsyncThrowingData(): Promise<QueryResponse<void>> {
    return this.queryData({ type: EQuery.ASYNC_EXCEPTION_QUERY });
  }

  public async queryAsyncNumberData(): Promise<QueryResponse<number>> {
    return this.queryData({ type: EQuery.ASYNC_NUMBER_QUERY });
  }

  public async queryAsyncStringData(data: string): Promise<QueryResponse<string>> {
    return this.queryData({ type: EQuery.ASYNC_STRING_QUERY, data });
  }

}
