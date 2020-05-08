import { mount } from "enzyme";
import { createElement } from "react";

import { ContextWorker, createProvider, OnSignal } from "@Lib";
import { nextAsyncQueue } from "@Lib/testing";

describe("Emitting signal on provision end.", () => {
  const count = jest.fn();

  class EmittingOnProvisionEnd extends ContextWorker {

    protected onProvisionEnded() {
      this.emitSignal({ type: "END" });
    }

  }

  class SubscribedToEndSignal extends ContextWorker {

    @OnSignal("END")
    private onEnd(): void {
      count();
    }

  }

  const FirstProvider = createProvider([ SubscribedToEndSignal, EmittingOnProvisionEnd ]);
  const SecondProvider = createProvider([ EmittingOnProvisionEnd, SubscribedToEndSignal ]);

  it("Should properly notify current managers when sending signal on unmount.", async () => {
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
