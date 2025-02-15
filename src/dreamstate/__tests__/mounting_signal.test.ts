import { mount } from "enzyme";
import { createElement, FunctionComponent } from "react";

import { ContextManager, ScopeProvider } from "@/dreamstate";
import { createProvider } from "@/dreamstate/core/provision/createProvider";
import { OnSignal } from "@/dreamstate/core/signals/OnSignal";

describe("Emitting signal on provision start", () => {
  const count = jest.fn();

  class EmittingOnProvisionStart extends ContextManager {
    public onProvisionStarted() {
      this.emitSignal({ type: "START" });
    }
  }

  class SubscribedToStartSignal extends ContextManager {
    @OnSignal("START")
    private onStart(): void {
      count();
    }
  }

  it("should properly notify current managers when sending signal on mount", async () => {
    async function testProvider(provider: FunctionComponent, times: number): Promise<void> {
      const tree = mount(createElement(ScopeProvider, {}, createElement(provider, {})));

      tree.unmount();

      expect(count).toHaveBeenCalledTimes(times);
    }

    await testProvider(
      createProvider([SubscribedToStartSignal, EmittingOnProvisionStart], {
        isCombined: false,
      }),
      1
    );
    await testProvider(
      createProvider([SubscribedToStartSignal, EmittingOnProvisionStart], {
        isCombined: true,
      }),
      2
    );
    await testProvider(
      createProvider([EmittingOnProvisionStart, SubscribedToStartSignal], {
        isCombined: false,
      }),
      3
    );
    await testProvider(
      createProvider([EmittingOnProvisionStart, SubscribedToStartSignal], {
        isCombined: true,
      }),
      4
    );
  });
});
