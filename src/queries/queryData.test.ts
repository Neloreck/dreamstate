import { QueryResponse } from "../index";
import { registerWorker, unRegisterWorker } from "../test-utils";
import { queryData } from "../queries";

import { EQuery, RespondingWorker } from "@Tests/assets/queries";

describe("queryData and queries processing.", () => {
  beforeEach(() => {
    registerWorker(RespondingWorker);
  });

  afterEach(() => {
    unRegisterWorker(RespondingWorker);
  });

  it("Should validate queryData params.", () => {
    expect(() => queryData(undefined as any)).toThrow(TypeError);
    expect(() => queryData(false as any)).toThrow(TypeError);
    expect(() => queryData(true as any)).toThrow(TypeError);
    expect(() => queryData(NaN as any)).toThrow(TypeError);
    expect(() => queryData("123" as any)).toThrow(TypeError);
    expect(() => queryData(1 as any)).toThrow(TypeError);
    expect(() => queryData(null as any)).toThrow(TypeError);
    expect(() => queryData([] as any)).toThrow(TypeError);
    expect(() => queryData({} as any)).toThrow(TypeError);
  });

  it("Should properly handle sync and async queryData listeners.", async () => {
    const stringResponse: QueryResponse<string> = await queryData({ type: EQuery.ASYNC_STRING_QUERY, data: "query" });
    const booleanResponse: QueryResponse<string> = await queryData({ type: EQuery.SYNC_BOOLEAN_QUERY, data: null });

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
    const numberResponse: QueryResponse<number> = await queryData({ type: EQuery.ASYNC_NUMBER_QUERY, data: null });
    const undefinedResponse: QueryResponse<any> = await queryData({ type: EQuery.UNDEFINED_QUERY, data: null });

    expect(numberResponse).not.toBeNull();
    expect(numberResponse!.data).toBe(100);
    expect(numberResponse!.answerer).toBe(RespondingWorker);
    expect(typeof numberResponse!.timestamp).toBe("number");

    expect(undefinedResponse).toBeNull();
  });

  it("Should properly handle errors in queries.", () => {
    expect(queryData({ type: EQuery.ASYNC_EXCEPTION_QUERY, data: null })).rejects.toBeInstanceOf(Error);
    expect(queryData({ type: EQuery.ASYNC_EXCEPTION_QUERY, data: null })).rejects.toBeInstanceOf(Error);
  });
});
