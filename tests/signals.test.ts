import { OnSignal, subscribeToSignals, unsubscribeFromSignals } from "../src/signals";
import { ContextManager } from "../src/management";
import { ISignalEvent, TAnyContextManagerConstructor, TSignalSubscriptionMetadata, TSignalType } from "../src/types";
import { IDENTIFIER_KEY, CONTEXT_SIGNAL_METADATA_REGISTRY } from "../src/internals";

import { nextAsyncQuery, registerManagerClass } from "./helpers";

describe("Signals and signaling.", () => {
  enum ESignal {
    NUMBER_SIGNAL = "NUMBER",
    STRING_SIGNAL = "STRING_SIGNAL",
    EMPTY_SIGNAL = "EMPTY_SIGNAL"
  }

  class SubscribedContextManager extends ContextManager<object> {

    public context: object = {};

    @OnSignal(ESignal.NUMBER_SIGNAL)
    public onNumberSignal(signal: ISignalEvent<TSignalType, number>): void {
      return;
    }

    @OnSignal([ ESignal.STRING_SIGNAL ])
    public onStringSignal(signal: ISignalEvent<TSignalType, string>): void {
      return;
    }

    @OnSignal([ ESignal.NUMBER_SIGNAL, ESignal.STRING_SIGNAL ])
    public onStringOrNumberSignal(signal: ISignalEvent<TSignalType, number | string>): void {
      return;
    }

  }

  class EmittingContextManager extends ContextManager<object> {

    public context: object = {};

    public sendNumberSignal(): void {
      this.emitSignal({ type: ESignal.NUMBER_SIGNAL, data: Math.random() });
    }

    public sendStringSignal(): void {
      this.emitSignal({ type: ESignal.STRING_SIGNAL, data: "random-" + Math.random() });
    }

    public sendEmptySignal(): void {
      this.emitSignal({ type: ESignal.EMPTY_SIGNAL });
    }

  }

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
    const subscribedManager: SubscribedContextManager = registerManagerClass(SubscribedContextManager);
    const emittingManager: EmittingContextManager = registerManagerClass(EmittingContextManager);

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
    const emittingManager: EmittingContextManager = registerManagerClass(EmittingContextManager);

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
    const emittingManager: EmittingContextManager = registerManagerClass(EmittingContextManager);

    const subscribedManager: SubscribedContextManager = registerManagerClass(SubscribedContextManager);

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
