import { getCurrentManager, QueryResponse } from "@Lib";

import { registerManagerClass, unRegisterManagerClass } from "@Tests/helpers";
import { RequestingContextManager, RespondingContextManager } from "@Tests/assets";

describe("Queries and queries processing.", () => {
  beforeEach(() => {
    registerManagerClass(RequestingContextManager);
    registerManagerClass(RespondingContextManager);
  });

  afterEach(() => {
    unRegisterManagerClass(RequestingContextManager);
    unRegisterManagerClass(RespondingContextManager);
  });

  it("Should properly find async query responders or fallback to null.", async () => {
    const requestingContextManager: RequestingContextManager = getCurrentManager(RequestingContextManager)!;
    const respondingContextManager: RespondingContextManager = getCurrentManager(RespondingContextManager)!;

    const numberResponse: QueryResponse<number> = await requestingContextManager.sendAsyncNumberQuery();
    const stringResponse: QueryResponse<string> = await requestingContextManager.sendAsyncStringQuery("query");
    const booleanResponse: QueryResponse<boolean> = await requestingContextManager.sendSyncBooleanQuery();
    const undefinedResponse: QueryResponse<any> = await requestingContextManager.sendUndefinedQuery();

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
    const requestingContextManager: RequestingContextManager = getCurrentManager(RequestingContextManager)!;

    expect(requestingContextManager.sendAsyncThrowingQuery()).rejects.toBeInstanceOf(Error);
    expect(requestingContextManager.sendSyncThrowingQuery()).rejects.toBeInstanceOf(Error);
  });
});
