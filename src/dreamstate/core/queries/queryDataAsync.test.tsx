import { mount, ReactWrapper } from "enzyme";
import { default as React, ReactElement, useEffect } from "react";

import { createProvider, DreamstateError, ScopeProvider, useScope } from "@/dreamstate";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { nextAsyncQueue } from "@/dreamstate/test-utils/utils/nextAsyncQueue";
import { TAnyValue, TOptionalQueryResponse, TQueryResponse } from "@/dreamstate/types";
import { EQuery, RespondingManager } from "@/fixtures/queries";

describe("queryDataAsync and queries processing", () => {
  type TQueryCb = (scope: IScopeContext) => void;

  const Provider = createProvider([RespondingManager]);

  function testQueryTree(checker: TQueryCb): ReactWrapper {
    return mount(
      <ScopeProvider>
        <Provider>
          <Consumer/>
        </Provider>
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

  it("should validate queryDataAsync params", async () => {
    const tree = testQueryTree(({ queryDataAsync }) => {
      expect(() => queryDataAsync([] as TAnyValue)).toThrow(DreamstateError);
      expect(() => queryDataAsync(["asd" as TAnyValue] as TAnyValue)).toThrow(DreamstateError);
      expect(() => queryDataAsync([{} as TAnyValue] as TAnyValue)).toThrow(DreamstateError);
      expect(() => queryDataAsync(undefined as TAnyValue)).toThrow(DreamstateError);
      expect(() => queryDataAsync(false as TAnyValue)).toThrow(DreamstateError);
      expect(() => queryDataAsync(true as TAnyValue)).toThrow(DreamstateError);
      expect(() => queryDataAsync(NaN as TAnyValue)).toThrow(DreamstateError);
      expect(() => queryDataAsync("123" as TAnyValue)).toThrow(DreamstateError);
      expect(() => queryDataAsync(1 as TAnyValue)).toThrow(DreamstateError);
      expect(() => queryDataAsync(null as TAnyValue)).toThrow(DreamstateError);
      expect(() => queryDataAsync({} as TAnyValue)).toThrow(DreamstateError);
    });

    await nextAsyncQueue();
    tree.unmount();
  });

  it("should properly handle sync and async queryDataAsync listeners", async () => {
    const tree = testQueryTree(async ({ queryDataAsync }) => {
      const stringResponse: TQueryResponse<string> = await queryDataAsync({
        type: EQuery.ASYNC_STRING_QUERY,
        data: "query",
      });
      const booleanResponse: TQueryResponse<boolean> = await queryDataAsync({
        type: EQuery.SYNC_BOOLEAN_QUERY,
        data: null,
      });

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

  it("should properly handle errors in queries", async () => {
    const tree = testQueryTree(async ({ queryDataAsync }) => {
      expect(queryDataAsync({ type: EQuery.ASYNC_EXCEPTION_QUERY, data: null })).rejects.toBeInstanceOf(Error);
      expect(queryDataAsync({ type: EQuery.SYNC_EXCEPTION_QUERY, data: null })).rejects.toBeInstanceOf(Error);
    });

    await nextAsyncQueue(100);
    tree.unmount();
  });

  it("should properly find async query responders or fallback to null for single queries", async () => {
    const tree = testQueryTree(async ({ queryDataAsync }) => {
      const numberResponse: TOptionalQueryResponse<number> = await queryDataAsync({
        type: EQuery.ASYNC_NUMBER_QUERY,
        data: undefined,
      });
      const undefinedResponse: TOptionalQueryResponse<215> = await queryDataAsync({
        type: EQuery.UNDEFINED_QUERY,
        data: undefined,
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
