import { ContextManager, OnQuery } from "@/dreamstate";
import { EQuery } from "@/fixtures/queries/EQuery";
import {
  TAsyncExceptionQuery,
  TAsyncNumberQuery,
  TAsyncStringQuery,
  TSyncBooleanQuery,
  TSyncExceptionQuery,
  TSyncStringQuery
} from "@/fixtures/queries/types";

export class RespondingManager extends ContextManager {

  public context = {};

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

  @OnQuery(EQuery.SYNC_STRING_QUERY)
  public onSyncStringQuery(queryRequest: TSyncStringQuery): string {
    return queryRequest.data;
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
