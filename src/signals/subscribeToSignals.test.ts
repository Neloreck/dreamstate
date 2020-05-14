import { emitSignal } from "@Lib/signals/emitSignal";
import { nextAsyncQueue } from "@Lib/testing/nextAsyncQueue";
import { subscribeToSignals } from "@Lib/signals/subscribeToSignals";
import { unsubscribeFromSignals } from "@Lib/signals/unsubscribeFromSignals";
import { SIGNAL_LISTENERS_REGISTRY } from "@Lib/internals";

describe("subscribeToSignals method.", () => {
  it("Should properly subscribe to signals.", async () => {
    expect(SIGNAL_LISTENERS_REGISTRY.size).toBe(0);

    const subscriber = jest.fn();

    subscribeToSignals(subscriber);

    emitSignal({ type: "test" });

    expect(SIGNAL_LISTENERS_REGISTRY.size).toBe(1);
    expect(SIGNAL_LISTENERS_REGISTRY.has(subscriber)).toBeTruthy();
    expect(subscriber).not.toHaveBeenCalled();

    await nextAsyncQueue();

    expect(subscriber).toHaveBeenCalled();

    unsubscribeFromSignals(subscriber);
  });
});
