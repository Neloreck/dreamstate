import { mount } from "enzyme";
import { createElement } from "react";

import { ContextService } from "@Lib/management/ContextService";
import { createProvider } from "@Lib/provision/createProvider";
import { OnSignal } from "@Lib/signals/OnSignal";
import { nextAsyncQueue } from "@Lib/testing/nextAsyncQueue";

describe("Emitting signal on provision start.", () => {
  const count = jest.fn();

  class EmittingOnProvisionStart extends ContextService {

    protected onProvisionStarted() {
      this.emitSignal({ type: "START" });
    }

  }

  class SubscribedToStartSignal extends ContextService {

    @OnSignal("START")
    private onStart(): void {
      count();
    }

  }

  const FirstProvider = createProvider([ SubscribedToStartSignal, EmittingOnProvisionStart ]);
  const SecondProvider = createProvider([ EmittingOnProvisionStart, SubscribedToStartSignal ]);

  it("Should properly notify current managers when sending signal on mount.", async () => {
    const firstTree = mount(createElement(FirstProvider, {}));

    await nextAsyncQueue();

    expect(count).toHaveBeenCalledTimes(1);

    firstTree.unmount();

    const secondTree = mount(createElement(SecondProvider, {}));

    await nextAsyncQueue();

    expect(count).toHaveBeenCalledTimes(2);

    secondTree.unmount();
  });
});
