import { ContextManager } from "@/dreamstate";
import { SIGNAL_METADATA_SYMBOL } from "@/dreamstate/core/internals";
import { OnSignal } from "@/dreamstate/core/signals/OnSignal";
import { mockManagerWithScope } from "@/dreamstate/test-utils/registry/mockManagerWithScope";
import { TSignalSubscriptionMetadata, TSignalType } from "@/dreamstate/types";
import { ESignal, SubscribedContextManager } from "@/fixtures/signals";

describe("@OnSignal metadata decorator", () => {
  it("Signal decorator should properly add metadata", () => {
    const [ manager ] = mockManagerWithScope(SubscribedContextManager);
    const signalListenersList: TSignalSubscriptionMetadata = manager[SIGNAL_METADATA_SYMBOL];

    expect(signalListenersList).toBeInstanceOf(Array);
    expect(signalListenersList).toHaveLength(3);

    expect(signalListenersList).toBeInstanceOf(Array);
    expect(signalListenersList[0]).toHaveLength(2);
    expect(signalListenersList[1]).toBeInstanceOf(Array);
    expect(signalListenersList[1]).toHaveLength(2);
    expect(signalListenersList[2]).toBeInstanceOf(Array);
    expect(signalListenersList[2]).toHaveLength(2);

    const [ firstMethod, firstSubscribed ] = signalListenersList[0];

    expect(firstMethod).toBe("onNumberSignal");
    expect(firstSubscribed).toBe(ESignal.NUMBER_SIGNAL);

    const [ secondMethod, secondSubscribed ] = signalListenersList[1];

    expect(secondMethod).toBe("onStringSignal");
    expect(secondSubscribed).toHaveLength(1);
    expect((secondSubscribed as Array<TSignalType>).includes(ESignal.STRING_SIGNAL)).toBeTruthy();

    const [ thirdMethod, thirdSubscribed ] = signalListenersList[2];

    expect(thirdMethod).toBe("onStringOrNumberSignal");
    expect(thirdSubscribed).toHaveLength(2);
    expect((thirdSubscribed as Array<TSignalType>).includes(ESignal.STRING_SIGNAL)).toBeTruthy();
    expect((thirdSubscribed as Array<TSignalType>).includes(ESignal.NUMBER_SIGNAL)).toBeTruthy();
  });

  it("Should work only with context services", () => {
    expect(() => {
      class Throwing extends ContextManager {

        @OnSignal(undefined as any)
        public onSignal(): number {
          return 0;
        }

      }
    }).toThrow(TypeError);

    expect(() => {
      class Throwing {

        @OnSignal("TEST")
        public onSignal(): number {
          return 0;
        }

      }
    }).toThrow(TypeError);
  });
});
