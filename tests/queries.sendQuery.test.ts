import { QueryResponse } from "@Lib";
import { registerWorker, unRegisterWorker } from "@Lib/test-utils";

import { EQuery, RespondingWorker } from "@Tests/assets/queries";
import { sendQuery } from "@Lib/queries";

describe("Queries and queries processing.", () => {
  beforeEach(() => {
    registerWorker(RespondingWorker);
  });

  afterEach(() => {
    unRegisterWorker(RespondingWorker);
  });

  it("Should properly handle sync and async sendQuery listeners.", async () => {
    const stringResponse: QueryResponse<string> = await sendQuery({ type: EQuery.ASYNC_STRING_QUERY, data: "query" });
    const booleanResponse: QueryResponse<string> = await sendQuery({ type: EQuery.SYNC_BOOLEAN_QUERY, data: null });

    expect(stringResponse).not.toBeNull();
    expect(stringResponse!.data).toBe("query");
    expect(stringResponse!.answerer).toBe(RespondingWorker);
    expect(typeof stringResponse!.timestamp).toBe("number");

    expect(booleanResponse).not.toBeNull();
    expect(booleanResponse!.data).toBe(true);
    expect(booleanResponse!.answerer).toBe(RespondingWorker);
    expect(typeof booleanResponse!.timestamp).toBe("number");
  });

  it("Should properly find async query responders or fallback to null.", async () => {
    const numberResponse: QueryResponse<number> = await sendQuery({ type: EQuery.ASYNC_NUMBER_QUERY, data: null });
    const undefinedResponse: QueryResponse<any> = await sendQuery({ type: EQuery.UNDEFINED_QUERY, data: null });

    expect(numberResponse).not.toBeNull();
    expect(numberResponse!.data).toBe(100);
    expect(numberResponse!.answerer).toBe(RespondingWorker);
    expect(typeof numberResponse!.timestamp).toBe("number");

    expect(undefinedResponse).toBeNull();
  });

  it("Should properly handle errors in queries.", () => {
    expect(sendQuery({ type: EQuery.ASYNC_EXCEPTION_QUERY, data: null })).rejects.toBeInstanceOf(Error);
    expect(sendQuery({ type: EQuery.ASYNC_EXCEPTION_QUERY, data: null })).rejects.toBeInstanceOf(Error);
  });
});
