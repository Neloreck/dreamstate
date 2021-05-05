import { emitSignal } from "@/dreamstate/core/signals/emitSignal";
import { subscribeToSignals } from "@/dreamstate/core/scoping/signals/subscribeToSignals";
import { unsubscribeFromSignals } from "@/dreamstate/core/scoping/signals/unsubscribeFromSignals";
import { registerService } from "@/dreamstate/test-utils/registry/registerService";
import { unRegisterService } from "@/dreamstate/test-utils/registry/unRegisterService";
import { nextAsyncQueue } from "@/dreamstate/test-utils/utils/nextAsyncQueue";
import { ISignalEvent, TSignalType } from "@/dreamstate/types";
import { ESignal, SubscribedContextManager } from "@/fixtures";

describe("emitSignal method", () => {
  it("Should properly reject bad emit parameters", () => {
    expect(() => emitSignal(null as any)).toThrow(TypeError);
    expect(() => emitSignal(false as any)).toThrow(TypeError);
    expect(() => emitSignal(NaN as any)).toThrow(TypeError);
    expect(() => emitSignal(undefined as any)).toThrow(TypeError);
    expect(() => emitSignal(Symbol.for("TEST") as any)).toThrow(TypeError);
    expect(() => emitSignal(Symbol("TEST") as any)).toThrow(TypeError);
    expect(() => emitSignal(0 as any)).toThrow(TypeError);
    expect(() => emitSignal(1 as any)).toThrow(TypeError);
    expect(() => emitSignal([] as any)).toThrow(TypeError);
    expect(() => emitSignal(new Set() as any)).toThrow(TypeError);
    expect(() => emitSignal({} as any)).toThrow(TypeError);
    expect(() => emitSignal({ type: Symbol.for("TEST") })).not.toThrow(Error);
    expect(() => emitSignal({ type: Symbol("TEST") })).not.toThrow(Error);
    expect(() => emitSignal({ type: 0 })).not.toThrow(Error);
    expect(() => emitSignal({ type: 98 })).not.toThrow(Error);
    expect(() => emitSignal({ type: "VALIDATION" })).not.toThrow(Error);
  });

  it("Should properly dispatch signals", async () => {
    const subscriber = jest.fn((signal: ISignalEvent<string, undefined>) => {
      expect(signal.type).toBe("TEST");
      expect(signal.data).toBeUndefined();
      expect(signal.canceled).toBeFalsy();
      expect(signal.emitter).toBeNull();
      expect(typeof signal.timestamp).toBe("number");
      expect(typeof signal.cancel).toBe("function");
    });

    subscribeToSignals(subscriber);

    emitSignal({ type: "TEST" });

    expect(subscriber).not.toHaveBeenCalled();

    await nextAsyncQueue();

    expect(subscriber).toHaveBeenCalled();

    unsubscribeFromSignals(subscriber);
  });

  it("Should properly inject data parameter", async () => {
    const subscriber = jest.fn((signal: ISignalEvent<string, number>) => {
      if (signal.type === "WITH_PARAM") {
        expect(signal.data).toBe(155);
      }
    });

    subscribeToSignals(subscriber);

    await emitSignal({ type: "WITH_PARAM", data: 155 });

    expect(subscriber).toHaveBeenCalled();
  });

  it("Should properly inject emitter parameter", async () => {
    const subscriber = jest.fn((signal: ISignalEvent<string, number>) => {
      if (signal.type === "WITH_EMITTER") {
        expect(signal.emitter).toBe(0);
      }
    });

    subscribeToSignals(subscriber);

    await emitSignal({ type: "WITH_EMITTER" }, 0 as any);

    expect(subscriber).toHaveBeenCalled();
  });

  it("Signal subscribers should properly cancel events and be called in declared order", async () => {
    const subscribedManager: SubscribedContextManager = registerService(SubscribedContextManager);

    subscribedManager.onStringSignal = jest.fn();
    subscribedManager.onStringOrNumberSignal = jest.fn((signal: ISignalEvent<TSignalType, any>) => signal.cancel());

    const firstSubscriber = jest.fn(() => {});
    const secondSubscriber = jest.fn(() => {});

    subscribeToSignals(firstSubscriber);
    subscribeToSignals(secondSubscriber);

    await emitSignal({ type: ESignal.STRING_SIGNAL });

    expect(subscribedManager.onStringSignal).toHaveBeenCalled();
    expect(subscribedManager.onStringOrNumberSignal).toHaveBeenCalled();
    expect(firstSubscriber).not.toHaveBeenCalled();
    expect(secondSubscriber).not.toHaveBeenCalled();

    unsubscribeFromSignals(firstSubscriber);
    unsubscribeFromSignals(secondSubscriber);

    unRegisterService(SubscribedContextManager);
  });
});
