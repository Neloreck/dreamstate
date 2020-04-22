import { subscribeToSignals, unsubscribeFromSignals } from "../src/signals";
import { ISignalEvent, TAnyContextManagerConstructor, TSignalSubscriptionMetadata, TSignalType } from "../src/types";
import { IDENTIFIER_KEY, CONTEXT_SIGNAL_METADATA_REGISTRY } from "../src/internals";
import { getCurrentManager } from "../src/registry";

import { nextAsyncQuery, registerManagerClass, unRegisterManagerClass } from "./helpers";
import { EmittingContextManager, ESignal, SubscribedContextManager } from "./assets";

describe("Signals and signaling.", () => {
  beforeEach(() => {
    registerManagerClass(SubscribedContextManager);
    registerManagerClass(EmittingContextManager);
  });

  afterEach(() => {
    unRegisterManagerClass(SubscribedContextManager);
    unRegisterManagerClass(EmittingContextManager);
  });

  it("Signal decorator should properly add metadata.", () => {
    const signalListenersList: TSignalSubscriptionMetadata = CONTEXT_SIGNAL_METADATA_REGISTRY[
      (SubscribedContextManager as TAnyContextManagerConstructor)[IDENTIFIER_KEY]
    ];

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
    const subscribedManager: SubscribedContextManager = getCurrentManager(SubscribedContextManager)!;
    const emittingManager: EmittingContextManager = getCurrentManager(EmittingContextManager)!;

    subscribedManager.onNumberSignal = jest.fn();
    subscribedManager.onStringSignal = jest.fn();
    subscribedManager.onStringOrNumberSignal = jest.fn();

    const clearMocks = () => {
      (subscribedManager.onNumberSignal as jest.Mocked<any>).mockClear();
      (subscribedManager.onStringSignal as jest.Mocked<any>).mockClear();
      (subscribedManager.onStringOrNumberSignal as jest.Mocked<any>).mockClear();
    };

    emittingManager.sendNumberSignal();
    await nextAsyncQuery();

    expect(subscribedManager.onNumberSignal).toBeCalled();
    expect(subscribedManager.onStringOrNumberSignal).toBeCalled();
    expect(subscribedManager.onStringSignal).not.toBeCalled();

    clearMocks();

    emittingManager.sendStringSignal();
    await nextAsyncQuery();

    expect(subscribedManager.onNumberSignal).not.toBeCalled();
    expect(subscribedManager.onStringOrNumberSignal).toBeCalled();
    expect(subscribedManager.onStringSignal).toBeCalled();

    clearMocks();

    emittingManager.sendEmptySignal();
    await nextAsyncQuery();

    expect(subscribedManager.onNumberSignal).not.toBeCalled();
    expect(subscribedManager.onStringOrNumberSignal).not.toBeCalled();
    expect(subscribedManager.onStringSignal).not.toBeCalled();
  });

  it("Signal subscribers should properly listen managers signals.", async () => {
    const emittingManager: EmittingContextManager = getCurrentManager(EmittingContextManager)!;

    const numberSubscriber = jest.fn((signal: ISignalEvent<TSignalType, number>) => {
      expect(signal.type).toBe(ESignal.NUMBER_SIGNAL);
      expect(typeof signal.data).toBe("number");
      expect(signal.emitter).toBe(emittingManager);
    });

    const stringSubscriber = jest.fn((signal: ISignalEvent<TSignalType, string>) => {
      expect(signal.type).toBe(ESignal.STRING_SIGNAL);
      expect(typeof signal.data).toBe("string");
      expect(signal.emitter).toBe(emittingManager);
    });

    subscribeToSignals(numberSubscriber);

    emittingManager.sendNumberSignal();
    await nextAsyncQuery();

    expect(numberSubscriber).toBeCalled();

    unsubscribeFromSignals(numberSubscriber);
    subscribeToSignals(stringSubscriber);

    emittingManager.sendStringSignal();
    await nextAsyncQuery();

    expect(stringSubscriber).toBeCalled();

    unsubscribeFromSignals(stringSubscriber);
  });

  it("Signal subscribers should properly cancel events and called in declared order.", async () => {
    const emittingManager: EmittingContextManager = getCurrentManager(EmittingContextManager)!;
    const subscribedManager: SubscribedContextManager = getCurrentManager(SubscribedContextManager)!;

    subscribedManager.onStringSignal = jest.fn();
    subscribedManager.onStringOrNumberSignal = jest.fn((signal: ISignalEvent<TSignalType, any>) => signal.cancel());

    const firstSubscriber = jest.fn(() => {});
    const secondSubscriber = jest.fn(() => {});

    subscribeToSignals(firstSubscriber);
    subscribeToSignals(secondSubscriber);

    emittingManager.sendStringSignal();
    await nextAsyncQuery();

    expect(subscribedManager.onStringSignal).toBeCalled();
    expect(subscribedManager.onStringOrNumberSignal).toBeCalled();
    expect(firstSubscriber).not.toBeCalled();
    expect(secondSubscriber).not.toBeCalled();

    unsubscribeFromSignals(firstSubscriber);
    unsubscribeFromSignals(secondSubscriber);
  });
});