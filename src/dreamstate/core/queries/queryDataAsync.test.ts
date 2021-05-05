import { queryDataAsync } from "@/dreamstate/core/queries/queryDataAsync";
import { registerService } from "@/dreamstate/test-utils/registry/registerService";
import { unRegisterService } from "@/dreamstate/test-utils/registry/unRegisterService";
import {TOptionalQueryResponse, TQueryResponse} from "@/dreamstate/types";
import { EQuery, RespondingManager } from "@/fixtures/queries";

describe("queryDataAsync and queries processing", () => {
  beforeEach(() => {
    registerService(RespondingManager);
  });

  afterEach(() => {
    unRegisterService(RespondingManager);
  });

  it("Should validate queryDataAsync params", () => {
    expect(() => queryDataAsync([] as any)).toThrow(TypeError);
    expect(() => queryDataAsync([ "asd" as any ] as any)).toThrow(TypeError);
    expect(() => queryDataAsync([ {} as any ] as any)).toThrow(TypeError);
    expect(() => queryDataAsync(undefined as any)).toThrow(TypeError);
    expect(() => queryDataAsync(false as any)).toThrow(TypeError);
    expect(() => queryDataAsync(true as any)).toThrow(TypeError);
    expect(() => queryDataAsync(NaN as any)).toThrow(TypeError);
    expect(() => queryDataAsync("123" as any)).toThrow(TypeError);
    expect(() => queryDataAsync(1 as any)).toThrow(TypeError);
    expect(() => queryDataAsync(null as any)).toThrow(TypeError);
    expect(() => queryDataAsync({} as any)).toThrow(TypeError);
  });

  it("Should properly handle sync and async queryDataAsync listeners", async () => {
    const stringResponse: TQueryResponse<string> =
      await queryDataAsync({ type: EQuery.ASYNC_STRING_QUERY, data: "query" });
    const booleanResponse: TQueryResponse<boolean> =
      await queryDataAsync({ type: EQuery.SYNC_BOOLEAN_QUERY, data: null });

    expect(stringResponse).not.toBeNull();
    expect(stringResponse!.data).toBe("query");
    expect(stringResponse!.answerer).toBe(RespondingManager);
    expect(typeof stringResponse!.timestamp).toBe("number");

    expect(booleanResponse).not.toBeNull();
    expect(booleanResponse!.data).toBe(true);
    expect(booleanResponse!.answerer).toBe(RespondingManager);
    expect(typeof booleanResponse!.timestamp).toBe("number");
  });

  it("Should properly handle errors in queries", () => {
    expect(queryDataAsync({ type: EQuery.ASYNC_EXCEPTION_QUERY, data: null })).rejects.toBeInstanceOf(Error);
    expect(queryDataAsync({ type: EQuery.SYNC_EXCEPTION_QUERY, data: null })).rejects.toBeInstanceOf(Error);
  });

  it("Should properly find async query responders or fallback to null for single queries", async () => {
    const numberResponse: TOptionalQueryResponse<number> = await queryDataAsync({ type: EQuery.ASYNC_NUMBER_QUERY });
    const undefinedResponse: TOptionalQueryResponse<215> = await queryDataAsync({ type: EQuery.UNDEFINED_QUERY });

    expect(numberResponse).not.toBeNull();
    expect(numberResponse!.data).toBe(100);
    expect(numberResponse!.answerer).toBe(RespondingManager);
    expect(typeof numberResponse!.timestamp).toBe("number");

    expect(undefinedResponse).toBeNull();
  });
});
