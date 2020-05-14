import { SIGNAL_LISTENERS_REGISTRY } from "@Lib/core/internals";
import { emitSignal } from "@Lib/core/signals/emitSignal";
import { subscribeToSignals } from "@Lib/core/signals/subscribeToSignals";
import { unsubscribeFromSignals } from "@Lib/core/signals/unsubscribeFromSignals";
import { nextAsyncQueue } from "@Lib/test-utils/utils/nextAsyncQueue";

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
