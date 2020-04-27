import { ContextWorker, ContextManager, OnQuery, QueryRequest, QueryResponse } from "@Lib";

export enum EQuery {
  SYNC_BOOLEAN_QUERY = "SYNC_BOOLEAN_QUERY",
  ASYNC_NUMBER_QUERY = "ASYNC_NUMBER_QUERY",
  ASYNC_STRING_QUERY = "ASYNC_STRING_QUERY",
  SYNC_EXCEPTION_QUERY = "SYNC_EXCEPTION_QUERY",
  ASYNC_EXCEPTION_QUERY = "ASYNC_EXCEPTION_QUERY",
  ASYNC_INTERCEPTOR_QUERY = "ASYNC_INTERCEPTOR_QUERY",
  UNDEFINED_QUERY = "UNDEFINED_QUERY"
}

export type TAsyncNumberQuery = QueryRequest<void, EQuery.ASYNC_NUMBER_QUERY>;
export type TAsyncStringQuery = QueryRequest<string, EQuery.ASYNC_STRING_QUERY>;
export type TSyncBooleanQuery = QueryRequest<void, EQuery.SYNC_BOOLEAN_QUERY>;
export type TAsyncExceptionQuery = QueryRequest<void, EQuery.ASYNC_EXCEPTION_QUERY>;
export type TSyncExceptionQuery = QueryRequest<void, EQuery.SYNC_EXCEPTION_QUERY>;
export type TAsyncInterceptorQuery = QueryRequest<void, EQuery.ASYNC_INTERCEPTOR_QUERY>;

export class RespondingContextManager extends ContextManager<object> {

  public context: object = {};

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

export class RespondingWorker extends ContextWorker {

  @OnQuery(EQuery.ASYNC_INTERCEPTOR_QUERY)
  public async onAsyncInterceptorQuery(queryRequest: TAsyncInterceptorQuery): Promise<number> {
    return Math.random();
  }

}

export class RequestingContextManager extends ContextManager<object> {

  public context: object = {};

  public async sendUndefinedQuery(): Promise<QueryResponse<any>> {
    return this.sendQuery({ type: EQuery.UNDEFINED_QUERY });
  }

  public async sendSyncThrowingQuery(): Promise<QueryResponse<void>> {
    return this.sendQuery({ type: EQuery.SYNC_EXCEPTION_QUERY });
  }

  public async sendSyncBooleanQuery(): Promise<QueryResponse<boolean>> {
    return this.sendQuery({ type: EQuery.SYNC_BOOLEAN_QUERY });
  }

  public async sendAsyncThrowingQuery(): Promise<QueryResponse<void>> {
    return this.sendQuery({ type: EQuery.ASYNC_EXCEPTION_QUERY });
  }

  public async sendAsyncNumberQuery(): Promise<QueryResponse<number>> {
    return this.sendQuery({ type: EQuery.ASYNC_NUMBER_QUERY });
  }

  public async sendAsyncStringQuery(data: string): Promise<QueryResponse<string>> {
    return this.sendQuery({ type: EQuery.ASYNC_STRING_QUERY, data });
  }

  public async sendInterceptorQuery(): Promise<QueryResponse<number>> {
    return this.sendQuery({ type: EQuery.ASYNC_INTERCEPTOR_QUERY });
  }

}
