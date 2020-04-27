import { emitSignal, subscribeToSignals, unsubscribeFromSignals } from "@Lib/signals";
import {
  ISignalEvent,
  TSignalSubscriptionMetadata,
  TSignalType
} from "@Lib/types";
import { CONTEXT_SIGNAL_METADATA_REGISTRY } from "@Lib/internals";
import { getCurrent } from "@Lib/registry";
import { nextAsyncQueue, registerWorkerClass, unRegisterWorkerClass } from "@Lib/test-utils";

import { EmittingContextManager, ESignal, SubscribedContextManager, SubscribedWorker } from "@Tests/assets";

describe("Signals and signaling.", () => {
  beforeEach(() => {
    registerWorkerClass(SubscribedContextManager);
    registerWorkerClass(EmittingContextManager);
    registerWorkerClass(SubscribedWorker);
  });

  afterEach(() => {
    unRegisterWorkerClass(SubscribedContextManager);
    unRegisterWorkerClass(EmittingContextManager);
    unRegisterWorkerClass(SubscribedWorker);
  });

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

  it("Signal decorator should properly add metadata.", async () => {
    const subscribedManager: SubscribedContextManager = getCurrent(SubscribedContextManager)!;
    const emittingManager: EmittingContextManager = getCurrent(EmittingContextManager)!;

    subscribedManager.onNumberSignal = jest.fn();
    subscribedManager.onStringSignal = jest.fn();
    subscribedManager.onStringOrNumberSignal = jest.fn();

    const clearMocks = () => {
      (subscribedManager.onNumberSignal as jest.Mocked<any>).mockClear();
      (subscribedManager.onStringSignal as jest.Mocked<any>).mockClear();
      (subscribedManager.onStringOrNumberSignal as jest.Mocked<any>).mockClear();
    };

    emittingManager.sendNumberSignal();
    await nextAsyncQueue();

    expect(subscribedManager.onNumberSignal).toHaveBeenCalled();
    expect(subscribedManager.onStringOrNumberSignal).toHaveBeenCalled();
    expect(subscribedManager.onStringSignal).not.toHaveBeenCalled();

    clearMocks();

    emittingManager.sendStringSignal();
    await nextAsyncQueue();

    expect(subscribedManager.onNumberSignal).not.toHaveBeenCalled();
    expect(subscribedManager.onStringOrNumberSignal).toHaveBeenCalled();
    expect(subscribedManager.onStringSignal).toHaveBeenCalled();

    clearMocks();

    emittingManager.sendEmptySignal();
    await nextAsyncQueue();

    expect(subscribedManager.onNumberSignal).not.toHaveBeenCalled();
    expect(subscribedManager.onStringOrNumberSignal).not.toHaveBeenCalled();
    expect(subscribedManager.onStringSignal).not.toHaveBeenCalled();
  });

  it("Signal subscribers should properly listen managers signals.", async () => {
    const emittingManager: EmittingContextManager = getCurrent(EmittingContextManager)!;

    const numberSubscriber = jest.fn((signal: ISignalEvent<TSignalType, number>) => {
      expect(signal.type).toBe(ESignal.NUMBER_SIGNAL);
      expect(typeof signal.data).toBe("number");
      expect(signal.emitter).toBe(EmittingContextManager);
    });

    const stringSubscriber = jest.fn((signal: ISignalEvent<TSignalType, string>) => {
      expect(signal.type).toBe(ESignal.STRING_SIGNAL);
      expect(typeof signal.data).toBe("string");
      expect(signal.emitter).toBe(EmittingContextManager);
    });

    subscribeToSignals(numberSubscriber);

    emittingManager.sendNumberSignal();
    await nextAsyncQueue();

    expect(numberSubscriber).toHaveBeenCalled();

    unsubscribeFromSignals(numberSubscriber);
    subscribeToSignals(stringSubscriber);

    emittingManager.sendStringSignal();
    await nextAsyncQueue();

    expect(stringSubscriber).toHaveBeenCalled();

    unsubscribeFromSignals(stringSubscriber);
  });

  it("Signal subscribers should properly cancel events and called in declared order.", async () => {
    const emittingManager: EmittingContextManager = getCurrent(EmittingContextManager)!;
    const subscribedManager: SubscribedContextManager = getCurrent(SubscribedContextManager)!;

    subscribedManager.onStringSignal = jest.fn();
    subscribedManager.onStringOrNumberSignal = jest.fn((signal: ISignalEvent<TSignalType, any>) => signal.cancel());

    const firstSubscriber = jest.fn(() => {});
    const secondSubscriber = jest.fn(() => {});

    subscribeToSignals(firstSubscriber);
    subscribeToSignals(secondSubscriber);

    emittingManager.sendStringSignal();
    await nextAsyncQueue();

    expect(subscribedManager.onStringSignal).toHaveBeenCalled();
    expect(subscribedManager.onStringOrNumberSignal).toHaveBeenCalled();
    expect(firstSubscriber).not.toHaveBeenCalled();
    expect(secondSubscriber).not.toHaveBeenCalled();

    unsubscribeFromSignals(firstSubscriber);
    unsubscribeFromSignals(secondSubscriber);
  });

  it("Should properly listen external signals.", async () => {
    const subscribedManager: SubscribedContextManager = getCurrent(SubscribedContextManager)!;

    subscribedManager.onStringSignal = jest.fn((signal: ISignalEvent<string>) => {
      expect(signal.emitter).toBeNull();
      expect(signal.type).toBe(ESignal.STRING_SIGNAL);
      expect(signal.data).toBe("next");
    });

    emitSignal({ type: ESignal.STRING_SIGNAL, data: "next" });

    await nextAsyncQueue();

    expect(subscribedManager.onStringSignal).toHaveBeenCalled();
  });

  it("Should properly trigger interceptors from contexts.", async () => {
    const subscribedInterceptor: SubscribedWorker = getCurrent(SubscribedWorker)!;
    const emittingContextManager: EmittingContextManager = getCurrent(EmittingContextManager)!;

    subscribedInterceptor.onNumberSignal = jest.fn();
    emittingContextManager.sendNumberSignal();

    await nextAsyncQueue();

    expect(subscribedInterceptor.onNumberSignal).toHaveBeenCalled();
  });

  fit("Should properly trigger interceptors from external context.", async () => {
    const subscribedInterceptor: SubscribedWorker = getCurrent(SubscribedWorker)!;

    subscribedInterceptor.onNumberSignal = jest.fn();

    emitSignal({ type: ESignal.NUMBER_SIGNAL });

    await nextAsyncQueue();

    expect(subscribedInterceptor.onNumberSignal).toHaveBeenCalled();
  });
});
