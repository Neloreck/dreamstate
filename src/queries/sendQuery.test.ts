import { QueryResponse } from "../index";
import { registerWorker, unRegisterWorker } from "../test-utils";
import { sendQuery } from "../queries";

import { EQuery, RespondingWorker } from "@Tests/assets/queries";

describe("sendQuery and queries processing.", () => {
  beforeEach(() => {
    registerWorker(RespondingWorker);
  });

  afterEach(() => {
    unRegisterWorker(RespondingWorker);
  });

  it("Should validate sendQuery params.", () => {
    expect(() => sendQuery(undefined as any)).toThrow(TypeError);
    expect(() => sendQuery(false as any)).toThrow(TypeError);
    expect(() => sendQuery(true as any)).toThrow(TypeError);
    expect(() => sendQuery(NaN as any)).toThrow(TypeError);
    expect(() => sendQuery("123" as any)).toThrow(TypeError);
    expect(() => sendQuery(1 as any)).toThrow(TypeError);
    expect(() => sendQuery(null as any)).toThrow(TypeError);
    expect(() => sendQuery([] as any)).toThrow(TypeError);
    expect(() => sendQuery({} as any)).toThrow(TypeError);
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
