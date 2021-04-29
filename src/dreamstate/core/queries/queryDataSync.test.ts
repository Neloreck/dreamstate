import { queryDataSync } from "@/dreamstate/core/queries/queryDataSync";
import { registerService } from "@/dreamstate/test-utils/registry/registerService";
import { unRegisterService } from "@/dreamstate/test-utils/registry/unRegisterService";
import { TQueryResponse } from "@/dreamstate/types";
import { EQuery, RespondingManager } from "@/fixtures/queries";

describe("queryDataSync and queries processing", () => {
  beforeEach(() => {
    registerService(RespondingManager);
  });

  afterEach(() => {
    unRegisterService(RespondingManager);
  });

  it("Should validate queryData params", () => {
    expect(() => queryDataSync({ type: "TEST", data: undefined })).not.toThrow(TypeError);
    expect(() => queryDataSync(undefined as any)).toThrow(TypeError);
    expect(() => queryDataSync(false as any)).toThrow(TypeError);
    expect(() => queryDataSync(true as any)).toThrow(TypeError);
    expect(() => queryDataSync(NaN as any)).toThrow(TypeError);
    expect(() => queryDataSync("123" as any)).toThrow(TypeError);
    expect(() => queryDataSync(1 as any)).toThrow(TypeError);
    expect(() => queryDataSync(null as any)).toThrow(TypeError);
    expect(() => queryDataSync({} as any)).toThrow(TypeError);
  });

  it("Should properly handle sync and async queryData listeners", async () => {
    const stringResponse: TQueryResponse<string> = queryDataSync({ type: EQuery.SYNC_STRING_QUERY, data: "query" });
    const asyncNumberResponse: TQueryResponse<Promise<number>> = queryDataSync({
      type: EQuery.ASYNC_NUMBER_QUERY
    });

    expect(stringResponse).not.toBeNull();
    expect(stringResponse!.data).toBe("query");
    expect(stringResponse!.answerer).toBe(RespondingManager);
    expect(typeof stringResponse!.timestamp).toBe("number");

    expect(asyncNumberResponse).not.toBeNull();
    expect(await asyncNumberResponse!.data).toBe(100);
    expect(asyncNumberResponse!.answerer).toBe(RespondingManager);
    expect(typeof asyncNumberResponse!.timestamp).toBe("number");
  });

  it("Should properly handle errors in queries", () => {
    expect(queryDataSync({ type: EQuery.ASYNC_EXCEPTION_QUERY, data: null })!.data).rejects.toBeInstanceOf(Error);
    expect(() => queryDataSync({ type: EQuery.SYNC_EXCEPTION_QUERY, data: null })).toThrow(Error);
  });
});
