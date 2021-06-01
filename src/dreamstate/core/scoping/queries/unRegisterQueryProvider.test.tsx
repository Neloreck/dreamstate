import { mount, ReactWrapper } from "enzyme";
import { default as React, ReactElement, useEffect } from "react";

import { ScopeProvider, useScope } from "@/dreamstate";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";

describe("registerQueryProvider method", () => {
  type TQueryCb = (scope: IScopeContext) => void;

  function testQueryTree(checker: TQueryCb): ReactWrapper {
    return mount(<ScopeProvider>
      <Consumer/>
    </ScopeProvider>);

    function Consumer(): ReactElement {
      const scope: IScopeContext = useScope();

      useEffect(() => {
        checker(scope);
      }, []);

      return <div> Sample </div>;
    }
  }

  it("Should properly unsubscribe from queries", async () => {
    const tree = testQueryTree(({
      INTERNAL: { REGISTRY }, registerQueryProvider, unRegisterQueryProvider
    }) => {
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

  it("Should properly deal with duplicated providers unsub", async () => {
    const tree = testQueryTree(({
      INTERNAL: { REGISTRY }, registerQueryProvider, unRegisterQueryProvider
    }) => {
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

  it("Should throw if handler is not a function", async () => {
    const tree = testQueryTree(({ unRegisterQueryProvider }) => {
      expect(() => unRegisterQueryProvider("ANY", null as any)).toThrow(Error);
      expect(() => unRegisterQueryProvider("ANY", 1 as any)).toThrow(Error);
      expect(() => unRegisterQueryProvider("ANY", false as any)).toThrow(Error);
      expect(() => unRegisterQueryProvider("ANY", {} as any)).toThrow(Error);
      expect(() => unRegisterQueryProvider("ANY", Symbol(123) as any)).toThrow(Error);
      expect(() => unRegisterQueryProvider("ANY", new Map() as any)).toThrow(Error);
      expect(() => unRegisterQueryProvider("ANY", new Set() as any)).toThrow(Error);
      expect(() => unRegisterQueryProvider("ANY", [] as any)).toThrow(Error);
      expect(() => unRegisterQueryProvider("ANY", () => {})).not.toThrow(Error);
    });

    tree.unmount();
  });
});
