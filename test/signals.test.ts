import { Signal, subscribeToSignals, unsubscribeFromSignals } from "../src/lib/signals";
import { ContextManager } from "../src/lib/management";
import { SIGNAL_LISTENER_LIST_KEY } from "../src/lib/internals";
import { ISignal, TSignalType } from "../src/lib/types";

import { nextAsyncQuery, registerManagerClass } from "./helpers";

describe("Signals and signaling.", () => {
  enum ESignal {
    NUMBER_SIGNAL = "NUMBER",
    STRING_SIGNAL = "STRING_SIGNAL",
    EMPTY_SIGNAL = "EMPTY_SIGNAL"
  }

  class SubscribedContextManager extends ContextManager<object> {

    public context: object = {};

    @Signal(ESignal.NUMBER_SIGNAL)
    public onNumberSignal(signal: ISignal<TSignalType, number>): void {
      return;
    }

    @Signal([ ESignal.STRING_SIGNAL ])
    public onStringSignal(signal: ISignal<TSignalType, string>): void {
      return;
    }

    @Signal([ ESignal.NUMBER_SIGNAL, ESignal.STRING_SIGNAL ])
    public onStringOrNumberSignal(signal: ISignal<TSignalType, number | string>): void {
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
    expect(SubscribedContextManager[SIGNAL_LISTENER_LIST_KEY]).toBeInstanceOf(Array);
    expect(SubscribedContextManager[SIGNAL_LISTENER_LIST_KEY]).toHaveLength(3);

    expect(SubscribedContextManager[SIGNAL_LISTENER_LIST_KEY][0]).toBeInstanceOf(Array);
    expect(SubscribedContextManager[SIGNAL_LISTENER_LIST_KEY][0]).toHaveLength(2);
    expect(SubscribedContextManager[SIGNAL_LISTENER_LIST_KEY][1]).toBeInstanceOf(Array);
    expect(SubscribedContextManager[SIGNAL_LISTENER_LIST_KEY][1]).toHaveLength(2);
    expect(SubscribedContextManager[SIGNAL_LISTENER_LIST_KEY][2]).toBeInstanceOf(Array);
    expect(SubscribedContextManager[SIGNAL_LISTENER_LIST_KEY][2]).toHaveLength(2);

    const [ firstMethod, firstFilter ] = SubscribedContextManager[SIGNAL_LISTENER_LIST_KEY][0];

    expect(firstMethod).toBe("onNumberSignal");
    expect(firstFilter(ESignal.NUMBER_SIGNAL)).toBeTruthy();
    expect(firstFilter(ESignal.STRING_SIGNAL)).toBeFalsy();
    expect(firstFilter(ESignal.EMPTY_SIGNAL)).toBeFalsy();

    const [ secondMethod, secondFilter ] = SubscribedContextManager[SIGNAL_LISTENER_LIST_KEY][1];

    expect(secondMethod).toBe("onStringSignal");
    expect(secondFilter(ESignal.NUMBER_SIGNAL)).toBeFalsy();
    expect(secondFilter(ESignal.STRING_SIGNAL)).toBeTruthy();
    expect(secondFilter(ESignal.EMPTY_SIGNAL)).toBeFalsy();

    const [ thirdMethod, thirdFilter ] = SubscribedContextManager[SIGNAL_LISTENER_LIST_KEY][2];

    expect(thirdMethod).toBe("onStringOrNumberSignal");
    expect(thirdFilter(ESignal.NUMBER_SIGNAL)).toBeTruthy();
    expect(thirdFilter(ESignal.STRING_SIGNAL)).toBeTruthy();
    expect(thirdFilter(ESignal.EMPTY_SIGNAL)).toBeFalsy();
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

    const numberSubscriber = jest.fn((signal: ISignal<TSignalType, number>) => {
      expect(signal.type).toBe(ESignal.NUMBER_SIGNAL);
      expect(typeof signal.data).toBe("number");
      expect(signal.emitter).toBe(emittingManager);
    });

    const stringSubscriber = jest.fn((signal: ISignal<TSignalType, string>) => {
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
    subscribedManager.onStringOrNumberSignal = jest.fn((signal: ISignal<TSignalType, any>) => signal.cancel());

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
