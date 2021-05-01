import { mount } from "enzyme";
import { createElement, FunctionComponent } from "react";

import { createProvider } from "@/dreamstate/core/provision/createProvider";
import { OnQuery } from "@/dreamstate/core/queries/OnQuery";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { nextAsyncQueue } from "@/dreamstate/test-utils/utils/nextAsyncQueue";

describe("Emitting signal on provision end", () => {
  const mock = jest.fn();

  class QueryingOnProvisionEnd extends ContextManager {

    protected async onProvisionEnded() {
      await this.queryDataAsync({ type: "END" });
    }

  }

  class AnsweringOnProvisionEnd extends ContextManager {

    @OnQuery("END")
    private onQuery(): void {
      mock();
    }

  }

  it("Should properly notify current managers when sending signal on unmount with combined provision", async () => {
    async function testProvider(provider: FunctionComponent, times: number): Promise<void> {
      const tree = mount(createElement(provider, {}));

      tree.unmount();

      await nextAsyncQueue();

      expect(mock).toHaveBeenCalledTimes(times);

      mock.mockClear();
    }

    await testProvider(createProvider([ AnsweringOnProvisionEnd, QueryingOnProvisionEnd ], { isCombined: false }), 0);
    await testProvider(createProvider([ AnsweringOnProvisionEnd, QueryingOnProvisionEnd ], { isCombined: true }), 0);
    await testProvider(createProvider([ QueryingOnProvisionEnd, AnsweringOnProvisionEnd ], { isCombined: false }), 1);
    await testProvider(createProvider([ QueryingOnProvisionEnd, AnsweringOnProvisionEnd ], { isCombined: true }), 1);
  });
});
