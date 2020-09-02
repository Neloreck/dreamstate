import { SIGNAL_LISTENERS_REGISTRY } from "@/dreamstate/core/internals";
import { emitSignal } from "@/dreamstate/core/signals/emitSignal";
import { subscribeToSignals } from "@/dreamstate/core/signals/subscribeToSignals";
import { unsubscribeFromSignals } from "@/dreamstate/core/signals/unsubscribeFromSignals";
import { nextAsyncQueue } from "@/dreamstate/test-utils/utils/nextAsyncQueue";

describe("unSubscribeFromSignals method", () => {
  it("Should properly unsubscribe from signals", async () => {
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
