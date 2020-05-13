import { QueryResponse } from "../index";
import { registerService, unRegisterService } from "../test-utils";
import { queryData } from "../queries";

import { EQuery, RespondingService } from "@Tests/../fixtures/queries";

describe("queryData and queries processing.", () => {
  beforeEach(() => {
    registerService(RespondingService);
  });

  afterEach(() => {
    unRegisterService(RespondingService);
  });

  it("Should validate queryData params.", () => {
    expect(() => queryData([])).not.toThrow(TypeError);
    expect(() => queryData([ { type: "TEST", data: undefined } ])).not.toThrow(TypeError);
    expect(() => queryData({ type: "TEST", data: undefined })).not.toThrow(TypeError);
    expect(() => queryData([ 1 as any ])).toThrow(TypeError);
    expect(() => queryData([ undefined as any ])).toThrow(TypeError);
    expect(() => queryData([ "asd" as any ])).toThrow(TypeError);
    expect(() => queryData([ {} as any ])).toThrow(TypeError);
    expect(() => queryData(undefined as any)).toThrow(TypeError);
    expect(() => queryData(false as any)).toThrow(TypeError);
    expect(() => queryData(true as any)).toThrow(TypeError);
    expect(() => queryData(NaN as any)).toThrow(TypeError);
    expect(() => queryData("123" as any)).toThrow(TypeError);
    expect(() => queryData(1 as any)).toThrow(TypeError);
    expect(() => queryData(null as any)).toThrow(TypeError);
    expect(() => queryData({} as any)).toThrow(TypeError);
  });

  it("Should properly handle sync and async queryData listeners.", async () => {
    const stringResponse: QueryResponse<string> = await queryData({ type: EQuery.ASYNC_STRING_QUERY, data: "query" });
    const booleanResponse: QueryResponse<boolean> = await queryData({ type: EQuery.SYNC_BOOLEAN_QUERY, data: null });

    expect(stringResponse).not.toBeNull();
    expect(stringResponse!.data).toBe("query");
    expect(stringResponse!.answerer).toBe(RespondingService);
    expect(typeof stringResponse!.timestamp).toBe("number");

    expect(booleanResponse).not.toBeNull();
    expect(booleanResponse!.data).toBe(true);
    expect(booleanResponse!.answerer).toBe(RespondingService);
    expect(typeof booleanResponse!.timestamp).toBe("number");
  });

  it("Should properly handle errors in queries.", () => {
    expect(queryData({ type: EQuery.ASYNC_EXCEPTION_QUERY, data: null })).rejects.toBeInstanceOf(Error);
    expect(queryData({ type: EQuery.ASYNC_EXCEPTION_QUERY, data: null })).rejects.toBeInstanceOf(Error);
  });
});
