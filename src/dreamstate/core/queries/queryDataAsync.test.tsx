import { mount, ReactWrapper } from "enzyme";
import { default as React, ReactElement, useEffect } from "react";

import { createProvider, ScopeProvider, useScope } from "@/dreamstate";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { nextAsyncQueue } from "@/dreamstate/test-utils/utils/nextAsyncQueue";
import { TOptionalQueryResponse, TQueryResponse } from "@/dreamstate/types";
import { EQuery, RespondingManager } from "@/fixtures/queries";

describe("queryDataAsync and queries processing", () => {
  type TQueryCb = (scope: IScopeContext) => void;

  const Provider = createProvider([ RespondingManager ]);

  function testQueryTree(checker: TQueryCb): ReactWrapper {
    return mount(<ScopeProvider>
      <Provider>
        <Consumer/>
      </Provider>
    </ScopeProvider>);

    function Consumer(): ReactElement {
      const scope: IScopeContext = useScope();

      useEffect(() => {
        checker(scope);
      }, []);

      return <div> Sample </div>;
    }
  }

  it("Should validate queryDataAsync params", async () => {
    const tree = testQueryTree(({ queryDataAsync }) => {
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

    await nextAsyncQueue();
    tree.unmount();
  });

  it("Should properly handle sync and async queryDataAsync listeners", async () => {
    const tree = testQueryTree(async ({ queryDataAsync }) => {
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

    await nextAsyncQueue(100);
    tree.unmount();
  });

  it("Should properly handle errors in queries", async () => {
    const tree = testQueryTree(async ({ queryDataAsync }) => {
      expect(queryDataAsync({ type: EQuery.ASYNC_EXCEPTION_QUERY, data: null })).rejects.toBeInstanceOf(Error);
      expect(queryDataAsync({ type: EQuery.SYNC_EXCEPTION_QUERY, data: null })).rejects.toBeInstanceOf(Error);
    });

    await nextAsyncQueue(100);
    tree.unmount();
  });

  it("Should properly find async query responders or fallback to null for single queries", async () => {
    const tree = testQueryTree(async ({ queryDataAsync }) => {
      const numberResponse: TOptionalQueryResponse<number> = await queryDataAsync({
        type: EQuery.ASYNC_NUMBER_QUERY, data: undefined
      });
      const undefinedResponse: TOptionalQueryResponse<215> = await queryDataAsync({
        type: EQuery.UNDEFINED_QUERY, data: undefined
      });

      expect(numberResponse).not.toBeNull();
      expect(numberResponse!.data).toBe(100);
      expect(numberResponse!.answerer).toBe(RespondingManager);
      expect(typeof numberResponse!.timestamp).toBe("number");

      expect(undefinedResponse).toBeNull();
    });

    await nextAsyncQueue(100);
    tree.unmount();
  });
});
