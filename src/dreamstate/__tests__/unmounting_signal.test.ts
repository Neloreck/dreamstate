import { mount } from "enzyme";
import { createElement, FunctionComponent } from "react";

import { ContextManager, ScopeProvider } from "@/dreamstate";
import { createProvider } from "@/dreamstate/core/provision/createProvider";
import { OnSignal } from "@/dreamstate/core/signals/OnSignal";

describe("Emitting signal on provision end", () => {
  const mock = jest.fn();

  class EmittingOnProvisionEnd extends ContextManager {

    public onProvisionEnded() {
      this.emitSignal({ type: "END" });
    }

  }

  class SubscribedToEndSignal extends ContextManager {

    @OnSignal("END")
    private onEnd(): void {
      mock();
    }

  }

  it("Should properly notify current managers when sending signal on unmount with combined provision", async () => {
    async function testProvider(provider: FunctionComponent, times: number): Promise<void> {
      const tree = mount(createElement(ScopeProvider, {}, createElement(provider, {})));

      tree.unmount();

      expect(mock).toHaveBeenCalledTimes(times);

      mock.mockClear();
    }

    await testProvider(
      createProvider([ SubscribedToEndSignal, EmittingOnProvisionEnd ], {
        isCombined: false
      }),
      0
    );
    await testProvider(
      createProvider([ SubscribedToEndSignal, EmittingOnProvisionEnd ], {
        isCombined: true
      }),
      0
    );
    await testProvider(
      createProvider([ EmittingOnProvisionEnd, SubscribedToEndSignal ], {
        isCombined: false
      }),
      1
    );
    await testProvider(
      createProvider([ EmittingOnProvisionEnd, SubscribedToEndSignal ], {
        isCombined: true
      }),
      1
    );
  });
});
