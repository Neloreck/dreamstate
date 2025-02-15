import { mount } from "enzyme";
import { default as React, ReactElement, useCallback, useEffect } from "react";

import { DreamstateError, ScopeProvider, useScope } from "@/dreamstate";
import { createRegistry, IRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { emitSignal } from "@/dreamstate/core/signals/emitSignal";
import {
  EDreamstateErrorCode,
  IBaseSignal,
  ISignalEvent,
  ISignalWithData,
  TAnyValue,
  TUninitializedValue,
} from "@/dreamstate/types";
import { ESignal, getCallableError } from "@/fixtures";

describe("emitSignal method", () => {
  it("should properly reject bad emit parameters", () => {
    const registry: IRegistry = createRegistry();

    expect(() => emitSignal(null as TAnyValue, null, registry)).toThrow(DreamstateError);
    expect(() => emitSignal(false as TAnyValue, null, registry)).toThrow(DreamstateError);
    expect(() => emitSignal(NaN as TAnyValue, null, registry)).toThrow(DreamstateError);
    expect(() => emitSignal(undefined as TAnyValue, null, registry)).toThrow(DreamstateError);
    expect(() => emitSignal(Symbol.for("TEST") as TAnyValue, null, registry)).toThrow(DreamstateError);
    expect(() => emitSignal(Symbol("TEST") as TAnyValue, null, registry)).toThrow(DreamstateError);
    expect(() => emitSignal(0 as TAnyValue, null, registry)).toThrow(DreamstateError);
    expect(() => emitSignal(1 as TAnyValue, null, registry)).toThrow(DreamstateError);
    expect(() => emitSignal([] as TAnyValue, null, registry)).toThrow(DreamstateError);
    expect(() => emitSignal(new Set() as TAnyValue, null, registry)).toThrow(DreamstateError);
    expect(() => emitSignal({} as TAnyValue, null, registry)).toThrow(DreamstateError);
    expect(() => emitSignal({ type: Symbol.for("TEST") }, null, registry)).not.toThrow();
    expect(() => emitSignal({ type: Symbol("TEST") }, null, registry)).not.toThrow();
    expect(() => emitSignal({ type: 0 }, null, registry)).not.toThrow();
    expect(() => emitSignal({ type: 98 }, null, registry)).not.toThrow();
    expect(() => emitSignal({ type: "VALIDATION" }, null, registry)).not.toThrow();
    expect(() => emitSignal({ type: [] as TAnyValue }, null, registry)).toThrow(DreamstateError);
    expect(() => emitSignal({ type: undefined as TAnyValue }, null, registry)).toThrow(DreamstateError);
    expect(() => emitSignal({ type: null as TAnyValue }, null, registry)).toThrow(DreamstateError);
    expect(() => emitSignal({ type: {} as TAnyValue }, null, registry)).toThrow(DreamstateError);
    expect(() => emitSignal({ type: new Map() as TAnyValue }, null, registry)).toThrow(DreamstateError);
    expect(
      getCallableError<DreamstateError>(() => emitSignal({ type: new Map() as TAnyValue }, null, registry)).code
    ).toBe(EDreamstateErrorCode.INCORRECT_SIGNAL_TYPE);
  });

  function MountEmitter({
    subscriber,
    emitter,
  }: {
    subscriber: (signal: ISignalEvent<TAnyValue>) => void;
    emitter: () => [IBaseSignal | ISignalWithData<TAnyValue>, TAnyValue];
  }): ReactElement {
    const scope: IScopeContext = useScope();

    useEffect(() => {
      scope.subscribeToSignals(subscriber);
      scope.emitSignal(...emitter());

      return () => scope.unsubscribeFromSignals(subscriber);
    }, []);

    return <div> Sample </div>;
  }

  it("should properly emit signals", async () => {
    const subscriber = jest.fn((signal: ISignalEvent) => {
      expect(signal.type).toBe("TEST");
      expect(signal.data).toBeUndefined();
      expect(signal.canceled).toBeFalsy();
      expect(signal.emitter).toBeNull();
      expect(typeof signal.timestamp).toBe("number");
      expect(typeof signal.cancel).toBe("function");
    });

    const tree = mount(
      <ScopeProvider>
        <MountEmitter subscriber={subscriber} emitter={() => [{ type: "TEST" }, null]}/>
      </ScopeProvider>
    );

    tree.mount();
    expect(subscriber).toHaveBeenCalled();
    tree.unmount();
  });

  it("should properly inject data parameter", async () => {
    const subscriber = jest.fn((signal: ISignalEvent<number>) => {
      if (signal.type === "WITH_PARAM") {
        expect(signal.data).toBe(155);
      }
    });

    const tree = mount(
      <ScopeProvider>
        <MountEmitter subscriber={subscriber} emitter={() => [{ type: "WITH_PARAM", data: 155 }, null]}/>
      </ScopeProvider>
    );

    tree.mount();
    expect(subscriber).toHaveBeenCalled();
    tree.unmount();
  });

  it("should properly inject emitter parameter", async () => {
    const subscriber = jest.fn((signal: ISignalEvent<number>) => {
      if (signal.type === "WITH_EMITTER") {
        expect(signal.emitter).toBe(0);
      }
    });

    const tree = mount(
      <ScopeProvider>
        <MountEmitter subscriber={subscriber} emitter={() => [{ type: "WITH_EMITTER" }, 0 as TAnyValue]}/>
      </ScopeProvider>
    );

    tree.mount();
    expect(subscriber).toHaveBeenCalled();
    tree.unmount();
  });

  it("signal subscribers should properly cancel events and be called in declared order", async () => {
    let emitter: (base: IBaseSignal) => void = null as TUninitializedValue;
    const mock = jest.fn().mockImplementationOnce((signalEvent: ISignalEvent<TAnyValue>) => {
      signalEvent.cancel();
    });

    function Subscriber(): ReactElement {
      const scope: IScopeContext = useScope();

      emitter = scope.emitSignal;

      const onSignal = useCallback((...args) => mock(...args), []);

      useEffect(() => scope.subscribeToSignals(onSignal), []);

      return <div> Sample </div>;
    }

    const firstTree = mount(
      <ScopeProvider>
        <Subscriber/>
        <Subscriber/>
        <Subscriber/>
      </ScopeProvider>
    );

    await emitter({ type: ESignal.STRING_SIGNAL });

    expect(mock).toHaveBeenCalledTimes(1);

    firstTree.unmount();

    mock.mockClear();

    const secondTree = mount(
      <ScopeProvider>
        <Subscriber/>
        <Subscriber/>
        <Subscriber/>
      </ScopeProvider>
    );

    await emitter({ type: ESignal.STRING_SIGNAL });
    expect(mock).toHaveBeenCalledTimes(3);

    secondTree.unmount();
  });
});
