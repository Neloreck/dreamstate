import { OnSignal } from "./OnSignal";
import { ContextService } from "../management";
import { TSignalSubscriptionMetadata, TSignalType } from "../types";
import { CONTEXT_SIGNAL_METADATA_REGISTRY } from "../internals";
import { nextAsyncQueue, registerService, unRegisterService } from "../testing";
import { emitSignal } from "./emitSignal";

import { ESignal, SubscribedContextManager } from "@Tests/../fixtures/signals";

describe("@OnSignal metadata decorator.", () => {
  it("Signal decorator should properly add metadata.", () => {
    const signalListenersList: TSignalSubscriptionMetadata =
      CONTEXT_SIGNAL_METADATA_REGISTRY.get(SubscribedContextManager)!;

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

  it("Signal decorator methods should properly subscribe.", async () => {
    const subscribedManager: SubscribedContextManager = registerService(SubscribedContextManager)!;

    subscribedManager.onNumberSignal = jest.fn();
    subscribedManager.onStringSignal = jest.fn();
    subscribedManager.onStringOrNumberSignal = jest.fn();

    const clearMocks = () => {
      (subscribedManager.onNumberSignal as jest.Mocked<any>).mockClear();
      (subscribedManager.onStringSignal as jest.Mocked<any>).mockClear();
      (subscribedManager.onStringOrNumberSignal as jest.Mocked<any>).mockClear();
    };

    emitSignal({ type: ESignal.NUMBER_SIGNAL });
    await nextAsyncQueue();

    expect(subscribedManager.onNumberSignal).toHaveBeenCalled();
    expect(subscribedManager.onStringOrNumberSignal).toHaveBeenCalled();
    expect(subscribedManager.onStringSignal).not.toHaveBeenCalled();

    clearMocks();

    emitSignal({ type: ESignal.STRING_SIGNAL });
    await nextAsyncQueue();

    expect(subscribedManager.onNumberSignal).not.toHaveBeenCalled();
    expect(subscribedManager.onStringOrNumberSignal).toHaveBeenCalled();
    expect(subscribedManager.onStringSignal).toHaveBeenCalled();

    clearMocks();

    emitSignal({ type: ESignal.EMPTY_SIGNAL });
    await nextAsyncQueue();

    expect(subscribedManager.onNumberSignal).not.toHaveBeenCalled();
    expect(subscribedManager.onStringOrNumberSignal).not.toHaveBeenCalled();
    expect(subscribedManager.onStringSignal).not.toHaveBeenCalled();

    unRegisterService(SubscribedContextManager)!;
  });

  it("Should work only with context services.", () => {
    expect(() => {
      class Throwing extends ContextService {

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
