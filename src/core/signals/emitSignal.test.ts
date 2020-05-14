import { emitSignal } from "@Lib/core/signals/emitSignal";
import { subscribeToSignals } from "@Lib/core/signals/subscribeToSignals";
import { unsubscribeFromSignals } from "@Lib/core/signals/unsubscribeFromSignals";
import { ISignalEvent, TSignalType } from "@Lib/core/types";
import { ESignal, SubscribedContextManager } from "@Lib/fixtures";
import { registerService } from "@Lib/test-utils/registry/registerService";
import { unRegisterService } from "@Lib/test-utils/registry/unRegisterService";
import { nextAsyncQueue } from "@Lib/test-utils/utils/nextAsyncQueue";

describe("emitSignal method.", () => {
  it("Should properly reject bad emit parameters.", () => {
    expect(() => emitSignal(null as any)).toThrow(TypeError);
    expect(() => emitSignal(false as any)).toThrow(TypeError);
    expect(() => emitSignal(NaN as any)).toThrow(TypeError);
    expect(() => emitSignal(undefined as any)).toThrow(TypeError);
    expect(() => emitSignal([] as any)).toThrow(TypeError);
    expect(() => emitSignal(new Set() as any)).toThrow(TypeError);
    expect(() => emitSignal({} as any)).toThrow(TypeError);
    expect(() => emitSignal({ type: "VALIDATION" })).not.toThrow(Error);
  });

  it("Should properly dispatch signals.", async () => {
    const subscriber = jest.fn((signal: ISignalEvent) => {
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

  it("Should properly inject data parameter.", async () => {
    const subscriber = jest.fn((signal: ISignalEvent) => {
      if (signal.type === "WITH_PARAM") {
        expect(signal.data).toBe(155);
      }
    });

    subscribeToSignals(subscriber);

    emitSignal({ type: "WITH_PARAM", data: 155 });

    await nextAsyncQueue();

    expect(subscriber).toHaveBeenCalled();
  });

  it("Should properly inject emitter parameter.", async () => {
    const subscriber = jest.fn((signal: ISignalEvent) => {
      if (signal.type === "WITH_EMITTER") {
        expect(signal.emitter).toBe(0);
      }
    });

    subscribeToSignals(subscriber);

    emitSignal({ type: "WITH_EMITTER" }, 0 as any);

    await nextAsyncQueue();

    expect(subscriber).toHaveBeenCalled();
  });

  it("Signal subscribers should properly cancel events and be called in declared order.", async () => {
    const subscribedManager: SubscribedContextManager = registerService(SubscribedContextManager);

    subscribedManager.onStringSignal = jest.fn();
    subscribedManager.onStringOrNumberSignal = jest.fn((signal: ISignalEvent<TSignalType, any>) => signal.cancel());

    const firstSubscriber = jest.fn(() => {});
    const secondSubscriber = jest.fn(() => {});

    subscribeToSignals(firstSubscriber);
    subscribeToSignals(secondSubscriber);

    emitSignal({ type: ESignal.STRING_SIGNAL });
    await nextAsyncQueue();

    expect(subscribedManager.onStringSignal).toHaveBeenCalled();
    expect(subscribedManager.onStringOrNumberSignal).toHaveBeenCalled();
    expect(firstSubscriber).not.toHaveBeenCalled();
    expect(secondSubscriber).not.toHaveBeenCalled();

    unsubscribeFromSignals(firstSubscriber);
    unsubscribeFromSignals(secondSubscriber);

    unRegisterService(SubscribedContextManager);
  });
});
