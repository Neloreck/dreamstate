import { mount } from "enzyme";
import { createElement } from "react";

import { ContextWorker, createProvider, OnQuery } from "@Lib";
import { nextAsyncQueue } from "@Lib/testing";

describe("Emitting signal on provision end.", () => {
  const count = jest.fn();

  class QueryingOnProvisionEnd extends ContextWorker {

    protected async onProvisionEnded() {
      await this.queryData({ type: "END" });
    }

  }

  class AnsweringOnProvisionEnd extends ContextWorker {

    @OnQuery("END")
    private onQuery(): void {
      count();
    }

  }

  const FirstProvider = createProvider([ AnsweringOnProvisionEnd, QueryingOnProvisionEnd ]);
  const SecondProvider = createProvider([ QueryingOnProvisionEnd, AnsweringOnProvisionEnd ]);

  it("Should properly query data while unmounting.", async () => {
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
