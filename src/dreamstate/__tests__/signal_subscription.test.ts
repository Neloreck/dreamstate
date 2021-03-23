import { mount } from "enzyme";
import { createElement } from "react";

import { createProvider } from "@/dreamstate/core/provision/createProvider";
import { ContextService } from "@/dreamstate/core/services/ContextService";
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

  class EmittingOnProvisionStart extends ContextService {

    protected onProvisionStarted(): void {
      this.emitSignal(demoSignal);
      this.emitSignal(emptySignal);
    }

  }

  class SubscribedToStartSignal extends ContextService {

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

  const FirstProvider = createProvider([ SubscribedToStartSignal, EmittingOnProvisionStart ]);
  const SecondProvider = createProvider([ EmittingOnProvisionStart, SubscribedToStartSignal ]);

  it("Should properly catch signals from other managers", async () => {
    const firstTree = mount(createElement(FirstProvider, {}));

    await nextAsyncQueue();

    expect(count).toHaveBeenCalledTimes(2);

    firstTree.unmount();

    const secondTree = mount(createElement(SecondProvider, {}));

    await nextAsyncQueue();

    expect(count).toHaveBeenCalledTimes(4);

    secondTree.unmount();
  });
});
