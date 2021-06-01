import { mount, ReactWrapper } from "enzyme";
import { default as React, ReactElement, useEffect } from "react";

import { createProvider, ScopeProvider, useScope } from "@/dreamstate";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { TQueryResponse } from "@/dreamstate/types";
import { EQuery, RespondingManager } from "@/fixtures/queries";

describe("queryDataSync and queries processing", () => {
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
    const tree = testQueryTree(({ queryDataSync }) => {
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

    tree.unmount();
  });

  it("Should properly handle sync and async queryDataAsync listeners", async () => {
    const tree = testQueryTree(({ queryDataSync }) => {
      expect(() => queryDataSync({ type: "TEST", data: undefined })).not.toThrow(TypeError);
      expect(() => queryDataSync(undefined as any)).toThrow(TypeError);
      expect(() => queryDataSync(false as any)).toThrow(TypeError);
      expect(() => queryDataSync(true as any)).toThrow(TypeError);
      expect(() => queryDataSync(NaN as any)).toThrow(TypeError);
      expect(() => queryDataSync("123" as any)).toThrow(TypeError);
      expect(() => queryDataSync(1 as any)).toThrow(TypeError);
      expect(() => queryDataSync(null as any)).toThrow(TypeError);
      expect(() => queryDataSync({} as any)).toThrow(TypeError);

      const stringResponse: TQueryResponse<string> = queryDataSync({ type: EQuery.SYNC_STRING_QUERY, data: "query" });
      const asyncNumberResponse: TQueryResponse<Promise<number>> = queryDataSync({
        type: EQuery.ASYNC_NUMBER_QUERY,
        data: undefined
      });

      expect(stringResponse).not.toBeNull();
      expect(stringResponse!.data).toBe("query");
      expect(stringResponse!.answerer).toBe(RespondingManager);
      expect(typeof stringResponse!.timestamp).toBe("number");

      expect(asyncNumberResponse).not.toBeNull();
      expect(asyncNumberResponse!.data).resolves.toBe(100);
      expect(asyncNumberResponse!.answerer).toBe(RespondingManager);
      expect(typeof asyncNumberResponse!.timestamp).toBe("number");
    });

    tree.unmount();
  });

  it("Should properly handle errors in queries", async () => {
    const tree = testQueryTree(({ queryDataSync }) => {
      expect(queryDataSync({ type: EQuery.ASYNC_EXCEPTION_QUERY, data: null })!.data).rejects.toBeInstanceOf(Error);
      expect(() => queryDataSync({ type: EQuery.SYNC_EXCEPTION_QUERY, data: null })).toThrow(Error);
    });

    tree.unmount();
  });
});
