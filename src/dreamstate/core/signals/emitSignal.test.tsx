import { mount } from "enzyme";
import { default as React, ReactElement, useCallback, useEffect } from "react";

import { ScopeProvider, useScope } from "@/dreamstate";
import { createRegistry, IRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { emitSignal } from "@/dreamstate/core/signals/emitSignal";
import { IBaseSignal, ISignalEvent, ISignalWithData, TSignalType } from "@/dreamstate/types";
import { ESignal } from "@/fixtures";

describe("emitSignal method", () => {
  it("Should properly reject bad emit parameters", () => {
    const registry: IRegistry = createRegistry();

    expect(() => emitSignal(null as any, null, registry)).toThrow(TypeError);
    expect(() => emitSignal(false as any, null, registry)).toThrow(TypeError);
    expect(() => emitSignal(NaN as any, null, registry)).toThrow(TypeError);
    expect(() => emitSignal(undefined as any, null, registry)).toThrow(TypeError);
    expect(() => emitSignal(Symbol.for("TEST") as any, null, registry)).toThrow(TypeError);
    expect(() => emitSignal(Symbol("TEST") as any, null, registry)).toThrow(TypeError);
    expect(() => emitSignal(0 as any, null, registry)).toThrow(TypeError);
    expect(() => emitSignal(1 as any, null, registry)).toThrow(TypeError);
    expect(() => emitSignal([] as any, null, registry)).toThrow(TypeError);
    expect(() => emitSignal(new Set() as any, null, registry)).toThrow(TypeError);
    expect(() => emitSignal({} as any, null, registry)).toThrow(TypeError);
    expect(() => emitSignal({ type: Symbol.for("TEST") }, null, registry)).not.toThrow(Error);
    expect(() => emitSignal({ type: Symbol("TEST") }, null, registry)).not.toThrow(Error);
    expect(() => emitSignal({ type: 0 }, null, registry)).not.toThrow(Error);
    expect(() => emitSignal({ type: 98 }, null, registry)).not.toThrow(Error);
    expect(() => emitSignal({ type: "VALIDATION" }, null, registry)).not.toThrow(Error);
  });

  function MountEmitter({
    subscriber,
    emitter
  }: {
    subscriber: (signal: ISignalEvent<any, any>) => void;
    emitter: () => [ IBaseSignal | ISignalWithData<TSignalType, any>, any ];
  }): ReactElement {
    const scope: IScopeContext = useScope();

    useEffect(() => {
      scope.subscribeToSignals(subscriber);
      scope.emitSignal(...emitter());

      return () => scope.unsubscribeFromSignals(subscriber);
    }, []);

    return <div> Sample </div>;
  }

  it("Should properly emit signals", async () => {
    const subscriber = jest.fn((signal: ISignalEvent<string, undefined>) => {
      expect(signal.type).toBe("TEST");
      expect(signal.data).toBeUndefined();
      expect(signal.canceled).toBeFalsy();
      expect(signal.emitter).toBeNull();
      expect(typeof signal.timestamp).toBe("number");
      expect(typeof signal.cancel).toBe("function");
    });

    const tree = mount(<ScopeProvider>
      <MountEmitter subscriber={subscriber} emitter={() => [ { type: "TEST" }, null ]}/>
    </ScopeProvider>);

    tree.mount();
    expect(subscriber).toHaveBeenCalled();
    tree.unmount();
  });

  it("Should properly inject data parameter", async () => {
    const subscriber = jest.fn((signal: ISignalEvent<string, number>) => {
      if (signal.type === "WITH_PARAM") {
        expect(signal.data).toBe(155);
      }
    });

    const tree = mount(<ScopeProvider>
      <MountEmitter subscriber={subscriber} emitter={() => [ { type: "WITH_PARAM", data: 155 }, null ]}/>
    </ScopeProvider>);

    tree.mount();
    expect(subscriber).toHaveBeenCalled();
    tree.unmount();
  });

  it("Should properly inject emitter parameter", async () => {
    const subscriber = jest.fn((signal: ISignalEvent<string, number>) => {
      if (signal.type === "WITH_EMITTER") {
        expect(signal.emitter).toBe(0);
      }
    });

    const tree = mount(<ScopeProvider>
      <MountEmitter subscriber={subscriber} emitter={() => [ { type: "WITH_EMITTER" }, 0 as any ]}/>
    </ScopeProvider>);

    tree.mount();
    expect(subscriber).toHaveBeenCalled();
    tree.unmount();
  });

  it("Signal subscribers should properly cancel events and be called in declared order", async () => {
    let emitter: (base: IBaseSignal) => void = null as any;
    const mock = jest.fn().mockImplementationOnce((signalEvent: ISignalEvent<any, any>) => {
      signalEvent.cancel();
    });

    function Subscriber(): ReactElement {
      const scope: IScopeContext = useScope();

      emitter = scope.emitSignal;

      const onSignal = useCallback((...args) => mock(...args), []);

      useEffect(() => scope.subscribeToSignals(onSignal), []);

      return <div> Sample </div>;
    }

    const firstTree = mount(<ScopeProvider>
      <Subscriber/>
      <Subscriber/>
      <Subscriber/>
    </ScopeProvider>);

    await emitter({ type: ESignal.STRING_SIGNAL });

    expect(mock).toHaveBeenCalledTimes(1);

    firstTree.unmount();

    mock.mockClear();

    const secondTree = mount(<ScopeProvider>
      <Subscriber/>
      <Subscriber/>
      <Subscriber/>
    </ScopeProvider>);

    await emitter({ type: ESignal.STRING_SIGNAL });
    expect(mock).toHaveBeenCalledTimes(3);

    secondTree.unmount();
  });
});
