import { mount } from "enzyme";
import { createElement, FunctionComponent } from "react";

import { ScopeProvider } from "@/dreamstate";
import { createProvider } from "@/dreamstate/core/provision/createProvider";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { OnSignal } from "@/dreamstate/core/signals/OnSignal";
import { nextAsyncQueue } from "@/dreamstate/test-utils/utils/nextAsyncQueue";
import { TDerivedSignal, TDerivedSignalEvent } from "@/dreamstate/types";

describe("Signal subscription of test classes", () => {
  const count = jest.fn();

  interface IDemoSignal extends TDerivedSignal<"DEMO", {
    strValue: string;
    numValue: number;
    boolValue: boolean;
  }> {}

  interface IEmptySignal extends TDerivedSignal<"EMPTY"> {
  }

  const demoSignal: IDemoSignal = {
    type: "DEMO",
    data: {
      strValue: "a",
      numValue: 1,
      boolValue: true
    }
  };

  const emptySignal: IEmptySignal = {
    type: "EMPTY"
  };

  class EmittingOnProvisionStart extends ContextManager {

    protected onProvisionStarted(): void {
      this.emitSignal(demoSignal);
      this.emitSignal(emptySignal);
    }

  }

  class SubscribedToStartSignal extends ContextManager {

    @OnSignal(demoSignal.type)
    private onDemo(signal: TDerivedSignalEvent<IDemoSignal>): void {
      count();

      const { type, data } = signal;

      expect(type).toBe("DEMO");
      expect(data).toBeDefined();
      expect(data.strValue).toBe("a");
      expect(data.numValue).toBe(1);
      expect(data.boolValue).toBe(true);
    }

    @OnSignal(emptySignal.type)
    private onEmpty(signal: TDerivedSignalEvent<IEmptySignal>): void {
      count();

      const { type } = signal;

      expect(type).toBe("EMPTY");
      expect(Object.hasOwnProperty.call(signal, "data")).toBeFalsy();
    }

  }

  it("Should properly catch signals from other managers", async () => {
    async function testProvider(provider: FunctionComponent, times: number): Promise<void> {
      const firstTree = mount(createElement(ScopeProvider, {}, createElement(provider, {})));

      await nextAsyncQueue();

      expect(count).toHaveBeenCalledTimes(times);

      firstTree.unmount();
    }

    await testProvider(createProvider([ SubscribedToStartSignal, EmittingOnProvisionStart ], { isCombined: true }), 2);
    await testProvider(createProvider([ EmittingOnProvisionStart, SubscribedToStartSignal ], { isCombined: true }), 4);
    await testProvider(createProvider([ SubscribedToStartSignal, EmittingOnProvisionStart ], { isCombined: false }), 6);
    await testProvider(createProvider([ EmittingOnProvisionStart, SubscribedToStartSignal ], { isCombined: false }), 8);
  });
});
