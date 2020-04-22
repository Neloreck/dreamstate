import { ContextManager } from "../src/management";
import { IQueryRequest, IQueryResponse } from "../src/types";
import { OnQuery } from "../src/queries";

import { registerManagerClass } from "./helpers";

describe("Signals and signaling.", () => {
  enum EQuery {
    SYNC_BOOLEAN_QUERY = "SYNC_BOOLEAN_QUERY",
    ASYNC_NUMBER_QUERY = "ASYNC_NUMBER_QUERY",
    ASYNC_STRING_QUERY = "ASYNC_STRING_QUERY",
    SYNC_EXCEPTION_QUERY = "SYNC_EXCEPTION_QUERY",
    ASYNC_EXCEPTION_QUERY = "ASYNC_EXCEPTION_QUERY",
    UNDEFINED_QUERY = "UNDEFINED_QUERY"
  }

  interface IAsyncNumberQueryRequest extends IQueryRequest<void, EQuery.ASYNC_NUMBER_QUERY> {
  }

  interface IAsyncStringQueryRequest extends IQueryRequest<string, EQuery.ASYNC_STRING_QUERY> {
  }

  interface ISyncBooleanQueryRequest extends IQueryRequest<string, EQuery.SYNC_BOOLEAN_QUERY> {
  }

  interface IAsyncExceptionQueryRequest extends IQueryRequest<void, EQuery.ASYNC_EXCEPTION_QUERY> {
  }

  interface ISyncExceptionQueryRequest extends IQueryRequest<void, EQuery.SYNC_EXCEPTION_QUERY> {
  }

  class RespondingContextManager extends ContextManager<object> {

    public context: object = {};

    @OnQuery(EQuery.ASYNC_EXCEPTION_QUERY)
    public async onAsyncExceptionQuery(queryRequest: IAsyncExceptionQueryRequest): Promise<never> {
      throw new Error();
    }

    @OnQuery(EQuery.SYNC_EXCEPTION_QUERY)
    public onSyncExceptionQuery(queryRequest: ISyncExceptionQueryRequest): never {
      throw new Error();
    }

    @OnQuery(EQuery.SYNC_BOOLEAN_QUERY)
    public onSyncBooleanQuery(queryRequest: ISyncBooleanQueryRequest): boolean {
      return true;
    }

    @OnQuery(EQuery.ASYNC_NUMBER_QUERY)
    public async onAsyncNumberQuery(queryRequest: IAsyncNumberQueryRequest): Promise<number> {
      return 100;
    }

    @OnQuery(EQuery.ASYNC_STRING_QUERY)
    public async onAsyncStringQuery(queryRequest: IAsyncStringQueryRequest): Promise<string> {
      return queryRequest.data;
    }

  }

  class RequestingContextManager extends ContextManager<object> {

    public context: object = {};

    public async sendUndefinedQuery(): Promise<IQueryResponse<any> | null> {
      return this.sendQuery({ type: EQuery.UNDEFINED_QUERY });
    }

    public async sendSyncThrowingQuery(): Promise<IQueryResponse<void> | null> {
      return this.sendQuery({ type: EQuery.SYNC_EXCEPTION_QUERY });
    }

    public async sendSyncBooleanQuery(): Promise<IQueryResponse<boolean> | null> {
      return this.sendQuery({ type: EQuery.SYNC_BOOLEAN_QUERY });
    }

    public async sendAsyncThrowingQuery(): Promise<IQueryResponse<void> | null> {
      return this.sendQuery({ type: EQuery.ASYNC_EXCEPTION_QUERY });
    }

    public async sendAsyncNumberQuery(): Promise<IQueryResponse<number> | null> {
      return this.sendQuery({ type: EQuery.ASYNC_NUMBER_QUERY });
    }

    public async sendAsyncStringQuery(data: string): Promise<IQueryResponse<string> | null> {
      return this.sendQuery({ type: EQuery.ASYNC_STRING_QUERY, data });
    }

  }

  it("Should properly find async query responders or fallback to null.", async () => {
    const requestingContextManager: RequestingContextManager = registerManagerClass(RequestingContextManager);
    const respondingContextManager: RespondingContextManager = registerManagerClass(RespondingContextManager);

    const numberResponse: IQueryResponse<number> | null = await requestingContextManager.sendAsyncNumberQuery();
    const stringResponse: IQueryResponse<string> | null = await requestingContextManager.sendAsyncStringQuery("query");
    const booleanResponse: IQueryResponse<boolean> | null = await requestingContextManager.sendSyncBooleanQuery();
    const undefinedResponse: IQueryResponse<any> | null = await requestingContextManager.sendUndefinedQuery();

    expect(numberResponse).not.toBeNull();
    expect(numberResponse!.data).toBe(100);
    expect(numberResponse!.answerer).toBe(respondingContextManager);

    expect(stringResponse).not.toBeNull();
    expect(stringResponse!.data).toBe("query");
    expect(booleanResponse!.answerer).toBe(respondingContextManager);

    expect(booleanResponse).not.toBeNull();
    expect(booleanResponse!.data).toBe(true);
    expect(booleanResponse!.answerer).toBe(respondingContextManager);

    expect(undefinedResponse).toBeNull();
  });

  it("Should properly handle responses in async queries.", async () => {
    const requestingContextManager: RequestingContextManager = registerManagerClass(RequestingContextManager);
    const respondingContextManager: RespondingContextManager = registerManagerClass(RespondingContextManager);

    expect(requestingContextManager.sendAsyncThrowingQuery()).rejects.toBeInstanceOf(Error);
    expect(requestingContextManager.sendSyncThrowingQuery()).rejects.toBeInstanceOf(Error);
  });
});
