import { mount } from "enzyme";
import { createElement } from "react";

import { ContextService, createProvider, OnQuery } from "../";
import { nextAsyncQueue } from "../testing";

describe("Emitting signal on provision end.", () => {
  const count = jest.fn();

  class QueryingOnProvisionEnd extends ContextService {

    protected async onProvisionEnded() {
      await this.queryData({ type: "END" });
    }

  }

  class AnsweringOnProvisionEnd extends ContextService {

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
