import { Signal, subscribeToSignals, unsubscribeFromSignals } from "../src/signals";
import { ContextManager } from "../src/management";
import { SIGNAL_LISTENER_LIST_KEY } from "../src/internals";
import { TSignalType } from "../src/types";

import { nextAsyncQuery, registerManagerInstance } from "./helpers";

describe("Signals and signaling.", () => {
  enum ESignal {
    NUMBER_SIGNAL = "NUMBER",
    STRING_SIGNAL = "STRING_SIGNAL",
    EMPTY_SIGNAL = "EMPTY_SIGNAL"
  }

  class SubscribedContextManager extends ContextManager<object> {

    public context: object = {};

    @Signal(ESignal.NUMBER_SIGNAL)
    public onNumberSignal(): void {
      return;
    }

    @Signal([ ESignal.STRING_SIGNAL ])
    public onStringSignal(): void {
      return;
    }

    @Signal([ ESignal.NUMBER_SIGNAL, ESignal.STRING_SIGNAL ])
    public onStringOrNumberSignal(): void {
      return;
    }

  }

  class EmittingContextManager extends ContextManager<object> {

    public context: object = {};

    public sendNumberSignal(): void {
      this.emitSignal(ESignal.NUMBER_SIGNAL, Math.random());
    }

    public sendStringSignal(): void {
      this.emitSignal(ESignal.STRING_SIGNAL, "random-" + Math.random());
    }

    public sendEmptySignal(): void {
      this.emitSignal(ESignal.EMPTY_SIGNAL);
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
    const subscribedManager: SubscribedContextManager = registerManagerInstance(SubscribedContextManager);
    const emittingManager: EmittingContextManager = registerManagerInstance(EmittingContextManager);

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
    const emittingManager: EmittingContextManager = registerManagerInstance(EmittingContextManager);

    const numberSubscriber = jest.fn((type: TSignalType, data: number, emitter: ContextManager<any>) => {
      expect(type).toBe(ESignal.NUMBER_SIGNAL);
      expect(typeof data).toBe("number");
      expect(emitter).toBe(emittingManager);
    });

    const stringSubscriber = jest.fn((type: TSignalType, data: number, emitter: ContextManager<any>) => {
      expect(type).toBe(ESignal.STRING_SIGNAL);
      expect(typeof data).toBe("string");
      expect(emitter).toBe(emittingManager);
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
});
