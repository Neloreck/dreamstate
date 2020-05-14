import { SIGNAL_LISTENERS_REGISTRY } from "@/dreamstate/core/internals";
import { emitSignal } from "@/dreamstate/signals/emitSignal";
import { subscribeToSignals } from "@/dreamstate/signals/subscribeToSignals";
import { unsubscribeFromSignals } from "@/dreamstate/signals/unsubscribeFromSignals";
import { nextAsyncQueue } from "@/dreamstate/test-utils/utils/nextAsyncQueue";

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
