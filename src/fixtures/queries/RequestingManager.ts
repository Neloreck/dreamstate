import { ContextManager } from "@/dreamstate";
import { TQueryResponse } from "@/dreamstate/types";
import { EQuery } from "@/fixtures/queries/EQuery";

export class RequestingManager extends ContextManager {

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
