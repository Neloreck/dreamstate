import { QUERY_PROVIDERS_REGISTRY } from "@/dreamstate/core/internals";
import { queryDataAsync } from "@/dreamstate/core/queries/queryDataAsync";
import { queryDataSync } from "@/dreamstate/core/queries/queryDataSync";
import { registerQueryProvider } from "@/dreamstate/core/scoping/queries/registerQueryProvider";
import { unRegisterQueryProvider } from "@/dreamstate/core/scoping/queries/unRegisterQueryProvider";
import { TQueryResponse } from "@/dreamstate/types";

describe("registerQueryProvider method", () => {
  it("Should properly subscribe to queries", async () => {
    expect(QUERY_PROVIDERS_REGISTRY.size).toBe(0);

    const provider = () => {
      return 1;
    };

    const unsub = registerQueryProvider("ANY", provider);

    const resultSync: TQueryResponse<number> = queryDataSync({ type: "ANY" });
    const resultAsync: TQueryResponse<number> = await queryDataAsync({ type: "ANY" });

    expect(resultSync.data).toBe(1);
    expect(resultSync.type).toBe("ANY");
    expect(resultAsync.data).toBe(1);
    expect(resultAsync.type).toBe("ANY");

    expect(QUERY_PROVIDERS_REGISTRY.size).toBe(1);
    expect(QUERY_PROVIDERS_REGISTRY.get("ANY")).toBeDefined();
    expect(QUERY_PROVIDERS_REGISTRY.get("ANY")).toHaveLength(1);

    unsub();

    expect(QUERY_PROVIDERS_REGISTRY.size).toBe(0);
    expect(QUERY_PROVIDERS_REGISTRY.get("ANY")).toBeUndefined();
  });

  it("Should properly deal with duplicated providers", async () => {
    expect(QUERY_PROVIDERS_REGISTRY.size).toBe(0);

    const provider = () => {};

    const unsub = registerQueryProvider("ANY", provider);

    expect(QUERY_PROVIDERS_REGISTRY.size).toBe(1);
    expect(QUERY_PROVIDERS_REGISTRY.get("ANY")).toBeDefined();
    expect(QUERY_PROVIDERS_REGISTRY.get("ANY")).toHaveLength(1);

    registerQueryProvider("ANY", provider);
    registerQueryProvider("ANY", provider);
    registerQueryProvider("ANY", provider);

    expect(QUERY_PROVIDERS_REGISTRY.size).toBe(1);
    expect(QUERY_PROVIDERS_REGISTRY.get("ANY")).toBeDefined();
    expect(QUERY_PROVIDERS_REGISTRY.get("ANY")).toHaveLength(1);

    unsub();

    expect(QUERY_PROVIDERS_REGISTRY.size).toBe(0);
    expect(QUERY_PROVIDERS_REGISTRY.get("ANY")).toBeUndefined();

    registerQueryProvider("1", provider);
    registerQueryProvider("2", provider);
    registerQueryProvider("3", provider);
    registerQueryProvider("3", provider);

    expect(QUERY_PROVIDERS_REGISTRY.size).toBe(3);
    expect(QUERY_PROVIDERS_REGISTRY.get("1")).toBeDefined();
    expect(QUERY_PROVIDERS_REGISTRY.get("2")).toBeDefined();
    expect(QUERY_PROVIDERS_REGISTRY.get("3")).toBeDefined();

    unRegisterQueryProvider("1", provider);
    unRegisterQueryProvider("2", provider);
    unRegisterQueryProvider("3", provider);
  });

  it("Should throw if handler is not a function", async () => {
    expect(QUERY_PROVIDERS_REGISTRY.size).toBe(0);

    expect(() => registerQueryProvider("ANY", null as any)).toThrow(Error);
    expect(() => registerQueryProvider("ANY", 1 as any)).toThrow(Error);
    expect(() => registerQueryProvider("ANY", false as any)).toThrow(Error);
    expect(() => registerQueryProvider("ANY", {} as any)).toThrow(Error);
    expect(() => registerQueryProvider("ANY", Symbol(123) as any)).toThrow(Error);
    expect(() => registerQueryProvider("ANY", new Map() as any)).toThrow(Error);
    expect(() => registerQueryProvider("ANY", new Set() as any)).toThrow(Error);
    expect(() => registerQueryProvider("ANY", [] as any)).toThrow(Error);
    expect(() => registerQueryProvider("ANY", () => {})).not.toThrow(Error);

    expect(QUERY_PROVIDERS_REGISTRY.size).toBe(1);
  });
});
