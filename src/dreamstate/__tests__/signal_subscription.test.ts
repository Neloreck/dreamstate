import { mount } from "enzyme";
import { createElement, FunctionComponent } from "react";

import { ScopeProvider } from "@/dreamstate";
import { createProvider } from "@/dreamstate/core/provision/createProvider";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { OnSignal } from "@/dreamstate/core/signals/OnSignal";
import { ISignalEvent, TDerivedSignal } from "@/dreamstate/types";

describe("Signal subscription of test classes", () => {
  const count = jest.fn();

  type TDemoSignal = TDerivedSignal<{
    strValue: string;
    numValue: number;
    boolValue: boolean;
  }>;

  const demoSignal: TDemoSignal = {
    type: "DEMO",
    data: {
      strValue: "a",
      numValue: 1,
      boolValue: true
    }
  };

  const emptySignal: TDerivedSignal = {
    type: "EMPTY"
  };

  class EmittingOnProvisionStart extends ContextManager {

    public onProvisionStarted(): void {
      this.emitSignal(demoSignal);
      this.emitSignal(emptySignal);
    }

  }

  class SubscribedToStartSignal extends ContextManager {

    @OnSignal(demoSignal.type)
    private onDemo(signal: TDemoSignal): void {
      count();

      const { type, data } = signal;

      expect(type).toBe("DEMO");
      expect(data).toBeDefined();
      expect(data.strValue).toBe("a");
      expect(data.numValue).toBe(1);
      expect(data.boolValue).toBe(true);
    }

    @OnSignal(emptySignal.type)
    private onEmpty(signal: ISignalEvent): void {
      count();

      const { type, data } = signal;

      expect(type).toBe("EMPTY");
      expect(data).toBeUndefined();
    }

  }

  it("should properly catch signals from other managers", async () => {
    async function testProvider(provider: FunctionComponent, times: number): Promise<void> {
      const firstTree = mount(createElement(ScopeProvider, {}, createElement(provider, {})));

      expect(count).toHaveBeenCalledTimes(times);

      firstTree.unmount();
    }

    await testProvider(
      createProvider([ SubscribedToStartSignal, EmittingOnProvisionStart ], {
        isCombined: true
      }),
      2
    );
    await testProvider(
      createProvider([ EmittingOnProvisionStart, SubscribedToStartSignal ], {
        isCombined: true
      }),
      4
    );
    await testProvider(
      createProvider([ SubscribedToStartSignal, EmittingOnProvisionStart ], {
        isCombined: false
      }),
      6
    );
    await testProvider(
      createProvider([ EmittingOnProvisionStart, SubscribedToStartSignal ], {
        isCombined: false
      }),
      8
    );
  });
});
