import { emitSignal } from "./emitSignal";
import { nextAsyncQueue } from "../testing";
import { subscribeToSignals } from "./subscribeToSignals";
import { unsubscribeFromSignals } from "./unsubscribeFromSignals";
import { SIGNAL_LISTENERS_REGISTRY } from "../internals";

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
