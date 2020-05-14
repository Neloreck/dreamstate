import { mount } from "enzyme";
import { createElement } from "react";

import { ContextService } from "@Lib/management/ContextService";
import { createProvider } from "@Lib/provision/createProvider";
import { OnSignal } from "@Lib/signals/OnSignal";
import { nextAsyncQueue } from "@Lib/testing/nextAsyncQueue";

describe("Emitting signal on provision end.", () => {
  const count = jest.fn();

  class EmittingOnProvisionEnd extends ContextService {

    protected onProvisionEnded() {
      this.emitSignal({ type: "END" });
    }

  }

  class SubscribedToEndSignal extends ContextService {

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
