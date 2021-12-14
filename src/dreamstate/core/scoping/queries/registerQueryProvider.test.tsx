import { mount, ReactWrapper } from "enzyme";
import { default as React, ReactElement, useEffect, useLayoutEffect } from "react";

import { DreamstateError, ScopeProvider, useScope } from "@/dreamstate";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { nextAsyncQueue } from "@/dreamstate/test-utils/utils/nextAsyncQueue";
import { EDreamstateErrorCode, TQueryResponse } from "@/dreamstate/types";
import { getCallableError } from "@/fixtures";

describe("registerQueryProvider method", () => {
  function QueryProvider(): ReactElement {
    const { registerQueryProvider }: IScopeContext = useScope();

    useLayoutEffect(() => registerQueryProvider("ANY", () => 1), []);

    return <div> Sample </div>;
  }

  type TQueryCb = (scope: IScopeContext) => void;

  function testQueryTree(checker: TQueryCb): ReactWrapper {
    return mount(
      <ScopeProvider>
        <QueryProvider/>
        <Consumer/>
      </ScopeProvider>
    );

    function Consumer(): ReactElement {
      const scope: IScopeContext = useScope();

      useEffect(() => {
        checker(scope);
      }, []);

      return <div> Sample </div>;
    }
  }

  it("Should properly subscribe to queries", async () => {
    const tree = testQueryTree(async ({ queryDataSync, queryDataAsync, INTERNAL: { REGISTRY } }) => {
      const resultSync: TQueryResponse<number> = queryDataSync({
        type: "ANY"
      });
      const resultAsync: TQueryResponse<number> = await queryDataAsync({
        type: "ANY"
      });

      expect(resultSync.data).toBe(1);
      expect(resultSync.type).toBe("ANY");
      expect(resultAsync.data).toBe(1);
      expect(resultAsync.type).toBe("ANY");

      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.size).toBe(1);
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("ANY")).toBeDefined();
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("ANY")).toHaveLength(1);
    });

    await nextAsyncQueue();
    tree.unmount();
  });

  it("Should properly deal with duplicated providers", () => {
    const tree = testQueryTree(({ registerQueryProvider, unRegisterQueryProvider, INTERNAL: { REGISTRY } }) => {
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.size).toBe(1);

      const provider = () => {};

      const unsub = registerQueryProvider("QUERY", provider);

      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.size).toBe(2);
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("QUERY")).toBeDefined();
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("QUERY")).toHaveLength(1);

      registerQueryProvider("QUERY", provider);
      registerQueryProvider("QUERY", provider);
      registerQueryProvider("QUERY", provider);

      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.size).toBe(2);
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("QUERY")).toBeDefined();
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("QUERY")).toHaveLength(1);

      unsub();

      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.size).toBe(1);
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("QUERY")).toBeUndefined();

      registerQueryProvider("1", provider);
      registerQueryProvider("2", provider);
      registerQueryProvider("3", provider);
      registerQueryProvider("3", provider);

      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.size).toBe(4);
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("1")).toBeDefined();
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("2")).toBeDefined();
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("3")).toBeDefined();

      unRegisterQueryProvider("1", provider);
      unRegisterQueryProvider("2", provider);
      unRegisterQueryProvider("3", provider);
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.size).toBe(1);
    });

    tree.unmount();
  });

  it("Should throw if handler is not a function", async () => {
    const tree = testQueryTree(({ registerQueryProvider, INTERNAL: { REGISTRY } }) => {
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.size).toBe(1);
      expect(() => registerQueryProvider("TYPE", null as any)).toThrow(Error);
      expect(() => registerQueryProvider("TYPE", 1 as any)).toThrow(Error);
      expect(() => registerQueryProvider("TYPE", false as any)).toThrow(Error);
      expect(() => registerQueryProvider("TYPE", {} as any)).toThrow(Error);
      expect(() => registerQueryProvider("TYPE", Symbol(123) as any)).toThrow(Error);
      expect(() => registerQueryProvider("TYPE", new Map() as any)).toThrow(Error);
      expect(() => registerQueryProvider("TYPE", new Set() as any)).toThrow(Error);
      expect(() => registerQueryProvider("TYPE", [] as any)).toThrow(Error);
      expect(() => registerQueryProvider("TYPE", () => {})).not.toThrow(Error);
      expect(getCallableError<DreamstateError>(() => registerQueryProvider("TEST", "D" as any)).code).toBe(
        EDreamstateErrorCode.INCORRECT_QUERY_PROVIDER
      );
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.size).toBe(2);
    });

    tree.unmount();
  });

  it("Should throw if type is not correct", async () => {
    const tree = testQueryTree(({ registerQueryProvider, INTERNAL: { REGISTRY } }) => {
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.size).toBe(1);
      expect(() => registerQueryProvider("TYPE", () => {})).not.toThrow();
      expect(() => registerQueryProvider(0, () => {})).not.toThrow();
      expect(() => registerQueryProvider(1000, () => {})).not.toThrow();
      expect(() => registerQueryProvider(Symbol("TEST"), () => {})).not.toThrow();
      expect(() => registerQueryProvider(Symbol.for("EXAMPLE"), () => {})).not.toThrow();
      expect(() => registerQueryProvider({} as any, () => {})).toThrow(DreamstateError);
      expect(() => registerQueryProvider(null as any, () => {})).toThrow(DreamstateError);
      expect(() => registerQueryProvider(undefined as any, () => {})).toThrow(DreamstateError);
      expect(() => registerQueryProvider([] as any, () => {})).toThrow(DreamstateError);
      expect(() => registerQueryProvider(new Map() as any, () => {})).toThrow(DreamstateError);
      expect(() => registerQueryProvider(new Set() as any, () => {})).toThrow(DreamstateError);
      expect(getCallableError<DreamstateError>(() => registerQueryProvider(new Set() as any, () => {})).code).toBe(
        EDreamstateErrorCode.INCORRECT_QUERY_TYPE
      );
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.size).toBe(6);
    });

    tree.unmount();
  });
});
