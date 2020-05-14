import { emitSignal } from "@Lib/signals/emitSignal";
import { nextAsyncQueue } from "@Lib/testing/nextAsyncQueue";
import { subscribeToSignals } from "@Lib/signals/subscribeToSignals";
import { unsubscribeFromSignals } from "@Lib/signals/unsubscribeFromSignals";
import { SIGNAL_LISTENERS_REGISTRY } from "@Lib/internals";

describe("unSubscribeFromSignals method.", () => {
  it("Should properly unsubscribe from signals.", async () => {
    expect(SIGNAL_LISTENERS_REGISTRY.size).toBe(0);

    const subscriber = jest.fn();

    subscribeToSignals(subscriber);
    unsubscribeFromSignals(subscriber);

    emitSignal({ type: "test" });

    expect(SIGNAL_LISTENERS_REGISTRY.size).toBe(0);
    expect(subscriber).not.toHaveBeenCalled();

    await nextAsyncQueue();

    expect(subscriber).not.toHaveBeenCalled();
  });
});
