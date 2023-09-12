import { mount, ReactWrapper } from "enzyme";
import { default as React, ReactElement, useEffect } from "react";

import { DreamstateError, ScopeProvider, useScope } from "@/dreamstate";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { EDreamstateErrorCode } from "@/dreamstate/types";
import { getCallableError } from "@/fixtures";

describe("registerQueryProvider method", () => {
  type TQueryCb = (scope: IScopeContext) => void;

  function testQueryTree(checker: TQueryCb): ReactWrapper {
    return mount(
      <ScopeProvider>
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

  it("should properly unsubscribe from queries", async () => {
    const tree = testQueryTree(({ INTERNAL: { REGISTRY }, registerQueryProvider, unRegisterQueryProvider }) => {
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.size).toBe(0);

      const provider = () => {
        return 1;
      };

      const unsub = registerQueryProvider("ANY", provider);

      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.size).toBe(1);
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("ANY")).toBeDefined();
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("ANY")).toHaveLength(1);

      unsub();

      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.size).toBe(0);
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("ANY")).toBeUndefined();

      registerQueryProvider("ANY", provider);

      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.size).toBe(1);
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("ANY")).toBeDefined();
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("ANY")).toHaveLength(1);

      unRegisterQueryProvider("ANY", provider);

      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.size).toBe(0);
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("ANY")).toBeUndefined();
    });

    tree.unmount();
  });

  it("should properly deal with duplicated providers unsub", async () => {
    const tree = testQueryTree(({ INTERNAL: { REGISTRY }, registerQueryProvider, unRegisterQueryProvider }) => {
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.size).toBe(0);

      const provider = () => {};

      const unsub = registerQueryProvider("ANY", provider);

      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.size).toBe(1);
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("ANY")).toBeDefined();
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("ANY")).toHaveLength(1);

      registerQueryProvider("ANY", provider);
      registerQueryProvider("ANY", provider);
      registerQueryProvider("ANY", provider);

      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.size).toBe(1);
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("ANY")).toBeDefined();
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("ANY")).toHaveLength(1);

      unsub();

      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.size).toBe(0);
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("ANY")).toBeUndefined();

      registerQueryProvider("1", provider);
      registerQueryProvider("2", provider);
      registerQueryProvider("3", provider);
      registerQueryProvider("3", provider);

      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.size).toBe(3);
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("1")).toBeDefined();
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("2")).toBeDefined();
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("3")).toBeDefined();

      unRegisterQueryProvider("3", provider);

      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.size).toBe(2);
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("1")).toBeDefined();
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("2")).toBeDefined();
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("3")).toBeUndefined();

      unRegisterQueryProvider("2", provider);

      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.size).toBe(1);
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("1")).toBeDefined();
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("2")).toBeUndefined();
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("3")).toBeUndefined();

      unRegisterQueryProvider("1", provider);

      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.size).toBe(0);
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("1")).toBeUndefined();
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("2")).toBeUndefined();
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.get("3")).toBeUndefined();
    });

    tree.unmount();
  });

  it("should throw if handler is not a function", async () => {
    const tree = testQueryTree(({ unRegisterQueryProvider, INTERNAL: { REGISTRY } }) => {
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.size).toBe(0);
      expect(() => unRegisterQueryProvider("ANY", null as any)).toThrow(DreamstateError);
      expect(() => unRegisterQueryProvider("ANY", 1 as any)).toThrow(DreamstateError);
      expect(() => unRegisterQueryProvider("ANY", false as any)).toThrow(DreamstateError);
      expect(() => unRegisterQueryProvider("ANY", {} as any)).toThrow(DreamstateError);
      expect(() => unRegisterQueryProvider("ANY", Symbol(123) as any)).toThrow(DreamstateError);
      expect(() => unRegisterQueryProvider("ANY", new Map() as any)).toThrow(DreamstateError);
      expect(() => unRegisterQueryProvider("ANY", new Set() as any)).toThrow(DreamstateError);
      expect(() => unRegisterQueryProvider("ANY", [] as any)).toThrow(DreamstateError);
      expect(() => unRegisterQueryProvider("ANY", () => {})).not.toThrow(DreamstateError);
      expect(getCallableError<DreamstateError>(() => unRegisterQueryProvider("ANY", [] as any)).code).toBe(
        EDreamstateErrorCode.INCORRECT_QUERY_PROVIDER
      );
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.size).toBe(0);
    });

    tree.unmount();
  });

  it("should throw if type is not correct", async () => {
    const tree = testQueryTree(({ unRegisterQueryProvider, INTERNAL: { REGISTRY } }) => {
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.size).toBe(0);
      expect(() => unRegisterQueryProvider("TYPE", () => {})).not.toThrow();
      expect(() => unRegisterQueryProvider(0, () => {})).not.toThrow();
      expect(() => unRegisterQueryProvider(1000, () => {})).not.toThrow();
      expect(() => unRegisterQueryProvider(Symbol("TEST"), () => {})).not.toThrow();
      expect(() => unRegisterQueryProvider(Symbol.for("TEST"), () => {})).not.toThrow();
      expect(() => unRegisterQueryProvider({} as any, () => {})).toThrow(DreamstateError);
      expect(() => unRegisterQueryProvider(null as any, () => {})).toThrow(DreamstateError);
      expect(() => unRegisterQueryProvider(undefined as any, () => {})).toThrow(DreamstateError);
      expect(() => unRegisterQueryProvider([] as any, () => {})).toThrow(DreamstateError);
      expect(() => unRegisterQueryProvider(new Map() as any, () => {})).toThrow(DreamstateError);
      expect(() => unRegisterQueryProvider(new Set() as any, () => {})).toThrow(DreamstateError);
      expect(getCallableError<DreamstateError>(() => unRegisterQueryProvider([] as any, () => {})).code).toBe(
        EDreamstateErrorCode.INCORRECT_QUERY_TYPE
      );
      expect(REGISTRY.QUERY_PROVIDERS_REGISTRY.size).toBe(0);
    });

    tree.unmount();
  });
});
