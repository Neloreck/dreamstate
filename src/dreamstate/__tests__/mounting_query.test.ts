import { mount } from "enzyme";
import { createElement, FunctionComponent } from "react";

import { ContextManager, ScopeProvider } from "@/dreamstate";
import { createProvider } from "@/dreamstate/core/provision/createProvider";
import { OnQuery } from "@/dreamstate/core/queries/OnQuery";
import { nextAsyncQueue } from "@/dreamstate/test-utils/utils/nextAsyncQueue";

/**
 * Construction occurs before initial provision start.
 * So mounting order does not impact listening start/stop.
 */
describe("Sending query on provision start", () => {
  const count = jest.fn((value: any) => {
    expect(value.type).toBe("START");
    expect(value.data).toBe("value");
  });

  class QueryingOnStart extends ContextManager {

    protected async onProvisionStarted() {
      count(await this.queryDataAsync({ type: "START" }));
    }

  }

  class AnsweringOnStart extends ContextManager {

    @OnQuery("START")
    private onQuery(): string {
      return "value";
    }

  }

  it("Should properly query data while mounting", async () => {
    async function testProvider(provider: FunctionComponent, times: number): Promise<void> {
      const tree = mount(createElement(ScopeProvider, {}, createElement(provider, {})));

      tree.unmount();

      await nextAsyncQueue();

      expect(count).toHaveBeenCalledTimes(times);

      count.mockClear();
    }

    await testProvider(createProvider([ AnsweringOnStart, QueryingOnStart ], { isCombined: true }),1);
    await testProvider(createProvider([ QueryingOnStart, AnsweringOnStart ], { isCombined: true }),1);
    await testProvider(createProvider([ AnsweringOnStart, QueryingOnStart ], { isCombined: false }),1);
    await testProvider(createProvider([ QueryingOnStart, AnsweringOnStart ], { isCombined: false }),1);
  });
});
