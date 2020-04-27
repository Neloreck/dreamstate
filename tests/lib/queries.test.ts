import { getCurrent, QueryResponse } from "@Lib";
import { registerWorkerClass, unRegisterWorkerClass } from "@Lib/test-utils";

import { RequestingContextManager, RespondingContextManager, RespondingWorker } from "@Tests/assets";

describe("Queries and queries processing.", () => {
  beforeEach(() => {
    registerWorkerClass(RequestingContextManager);
    registerWorkerClass(RespondingContextManager);
    registerWorkerClass(RespondingWorker);
  });

  afterEach(() => {
    unRegisterWorkerClass(RequestingContextManager);
    unRegisterWorkerClass(RespondingContextManager);
    unRegisterWorkerClass(RespondingWorker);
  });

  it("Should properly find async query responders or fallback to null.", async () => {
    const requestingContextManager: RequestingContextManager = getCurrent(RequestingContextManager)!;

    const numberResponse: QueryResponse<number> = await requestingContextManager.sendAsyncNumberQuery();
    const stringResponse: QueryResponse<string> = await requestingContextManager.sendAsyncStringQuery("query");
    const booleanResponse: QueryResponse<boolean> = await requestingContextManager.sendSyncBooleanQuery();
    const interceptorResponse: QueryResponse<number> = await requestingContextManager.sendInterceptorQuery();
    const undefinedResponse: QueryResponse<any> = await requestingContextManager.sendUndefinedQuery();

    expect(numberResponse).not.toBeNull();
    expect(numberResponse!.data).toBe(100);
    expect(numberResponse!.answerer).toBe(RespondingContextManager);

    expect(stringResponse).not.toBeNull();
    expect(stringResponse!.data).toBe("query");
    expect(booleanResponse!.answerer).toBe(RespondingContextManager);

    expect(booleanResponse).not.toBeNull();
    expect(booleanResponse!.data).toBe(true);
    expect(booleanResponse!.answerer).toBe(RespondingContextManager);

    expect(interceptorResponse).not.toBeNull();
    expect(typeof interceptorResponse!.data).toBe("number");
    expect(interceptorResponse!.answerer).toBe(RespondingWorker);

    expect(undefinedResponse).toBeNull();
  });

  it("Should properly handle errors in queries.", () => {
    const requestingContextManager: RequestingContextManager = getCurrent(RequestingContextManager)!;

    expect(requestingContextManager.sendAsyncThrowingQuery()).rejects.toBeInstanceOf(Error);
    expect(requestingContextManager.sendSyncThrowingQuery()).rejects.toBeInstanceOf(Error);
  });
});
