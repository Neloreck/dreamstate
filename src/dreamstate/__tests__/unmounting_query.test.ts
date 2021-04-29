import { mount } from "enzyme";
import { createElement } from "react";

import { createProvider } from "@/dreamstate/core/provision/createProvider";
import { OnQuery } from "@/dreamstate/core/queries/OnQuery";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { nextAsyncQueue } from "@/dreamstate/test-utils/utils/nextAsyncQueue";

describe("Emitting signal on provision end", () => {
  const count = jest.fn();

  class QueryingOnProvisionEnd extends ContextManager {

    protected async onProvisionEnded() {
      await this.queryDataAsync({ type: "END" });
    }

  }

  class AnsweringOnProvisionEnd extends ContextManager {

    @OnQuery("END")
    private onQuery(): void {
      count();
    }

  }

  const FirstProvider = createProvider([ AnsweringOnProvisionEnd, QueryingOnProvisionEnd ]);
  const SecondProvider = createProvider([ QueryingOnProvisionEnd, AnsweringOnProvisionEnd ]);

  it("Should properly query data while unmounting", async () => {
    const firstTree = mount(createElement(FirstProvider, {}));

    firstTree.unmount();

    await nextAsyncQueue();

    expect(count).toHaveBeenCalledTimes(1);

    const secondTree = mount(createElement(SecondProvider, {}));

    secondTree.unmount();

    await nextAsyncQueue();

    expect(count).toHaveBeenCalledTimes(1);
  });
});
