import { ContextManager, DreamstateError } from "@/dreamstate";
import { createScope } from "@/dreamstate/core/scoping/createScope";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { TAnyObject, TAnyValue } from "@/dreamstate/types";
import { TestManager } from "@/fixtures";

describe("createScope method", () => {
  it("should properly add contextManagers subscribers", () => {
    const {
      INTERNAL: {
        registerManager,
        subscribeToManager,
        unsubscribeFromManager,
        unRegisterManager,
        REGISTRY: { CONTEXT_SUBSCRIBERS_REGISTRY },
      },
    }: IScopeContext = createScope();

    const exampleSubscriber = () => {};

    registerManager(TestManager);

    expect(typeof CONTEXT_SUBSCRIBERS_REGISTRY.get(TestManager)).toBe("object");
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestManager)!.size).toBe(0);

    subscribeToManager(TestManager, exampleSubscriber);

    expect(typeof CONTEXT_SUBSCRIBERS_REGISTRY.get(TestManager)).toBe("object");
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestManager)!.size).toBe(1);

    unsubscribeFromManager(TestManager, exampleSubscriber);

    expect(typeof CONTEXT_SUBSCRIBERS_REGISTRY.get(TestManager)).toBe("object");
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestManager)!.size).toBe(0);

    unRegisterManager(TestManager);

    expect(typeof CONTEXT_SUBSCRIBERS_REGISTRY.get(TestManager)).toBe("object");
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestManager)!.size).toBe(0);
  });

  it("should properly subscribe and unsubscribe only from contextManagers", () => {
    const {
      INTERNAL: { registerManager, subscribeToManager, unsubscribeFromManager, unRegisterManager },
    }: IScopeContext = createScope();

    class ExampleClass {}

    class ExampleManagerClass extends ContextManager<TAnyObject> {
      public readonly context: TAnyObject = {};
    }

    const exampleSubscriber = jest.fn();

    expect(() => subscribeToManager(ExampleClass as TAnyValue, exampleSubscriber)).toThrow(DreamstateError);
    expect(() => unsubscribeFromManager(ExampleClass as TAnyValue, exampleSubscriber)).toThrow(DreamstateError);

    registerManager(ExampleManagerClass);

    expect(() => subscribeToManager(ExampleManagerClass, exampleSubscriber)).not.toThrow();
    expect(() => unsubscribeFromManager(ExampleManagerClass, exampleSubscriber)).not.toThrow();

    unRegisterManager(ExampleManagerClass);
  });

  it("should properly get current state of managers", () => {
    const {
      INTERNAL: { registerManager, unRegisterManager, REGISTRY },
      getContextOf,
      getInstanceOf,
    }: IScopeContext = createScope();

    class ExampleManagerClass extends ContextManager<TAnyObject> {
      public readonly context: TAnyObject = {
        a: 1,
        b: 2,
        c: 3,
      };
    }

    registerManager(ExampleManagerClass);

    const manager: ExampleManagerClass = getInstanceOf(ExampleManagerClass);
    const context: TAnyObject = getContextOf(ExampleManagerClass);

    expect(manager).toBeDefined();
    expect(manager).toBeInstanceOf(ExampleManagerClass);

    expect(context).toBeDefined();
    expect(context).not.toBeNull();
    expect(context).not.toBe(REGISTRY.CONTEXT_STATES_REGISTRY.get(ExampleManagerClass));
    expect(context).not.toBe(getContextOf(ExampleManagerClass));

    expect(context.a).toBe(1);
    expect(context.b).toBe(2);
    expect(context.c).toBe(3);

    expect(manager.context).toEqual(context);

    unRegisterManager(ExampleManagerClass);
  });

  it("should properly get null for not registered managers", () => {
    const { getContextOf, getInstanceOf }: IScopeContext = createScope();

    class ExampleManagerClass extends ContextManager<TAnyObject> {}

    expect(getInstanceOf(ExampleManagerClass)).toBeNull();
    expect(getContextOf(ExampleManagerClass)).toBeNull();
  });

  it("should subscribe only with functional params for handling", () => {
    const { subscribeToSignals }: IScopeContext = createScope();

    expect(() => subscribeToSignals(1 as TAnyValue)).toThrow(DreamstateError);
    expect(() => subscribeToSignals(0 as TAnyValue)).toThrow(DreamstateError);
    expect(() => subscribeToSignals("" as TAnyValue)).toThrow(DreamstateError);
    expect(() => subscribeToSignals({} as TAnyValue)).toThrow(DreamstateError);
    expect(() => subscribeToSignals([] as TAnyValue)).toThrow(DreamstateError);
    expect(() => subscribeToSignals(new Map() as TAnyValue)).toThrow(DreamstateError);
    expect(() => subscribeToSignals(Symbol("TEST") as TAnyValue)).toThrow(DreamstateError);
    expect(() => subscribeToSignals(null as TAnyValue)).toThrow(DreamstateError);
    expect(() => subscribeToSignals(undefined as TAnyValue)).toThrow(DreamstateError);
  });

  it("should properly return register status", () => {
    const {
      INTERNAL: { registerManager, unRegisterManager },
    }: IScopeContext = createScope();

    class ExampleManagerClass extends ContextManager<TAnyObject> {}

    expect(registerManager(ExampleManagerClass)).toBeTruthy();
    expect(registerManager(ExampleManagerClass)).toBeFalsy();
    expect(registerManager(ExampleManagerClass)).toBeFalsy();

    expect(unRegisterManager(ExampleManagerClass)).toBeTruthy();
    expect(unRegisterManager(ExampleManagerClass)).toBeFalsy();
    expect(unRegisterManager(ExampleManagerClass)).toBeFalsy();
  });

  it("should override context on register if required", () => {
    const {
      INTERNAL: { registerManager },
      getContextOf,
      getInstanceOf,
    }: IScopeContext = createScope();

    class ExampleManagerClass extends ContextManager<TAnyObject> {}

    registerManager(ExampleManagerClass, {}, { one: 1, two: 2 });
    expect(getInstanceOf(ExampleManagerClass).context).toStrictEqual({ one: 1, two: 2 });
    expect(getContextOf(ExampleManagerClass)).toStrictEqual({ one: 1, two: 2 });

    registerManager(TestManager, {}, { fourth: 4, fifth: "fifth" });
    expect(getContextOf(TestManager)).toStrictEqual({
      first: "first",
      second: 2,
      third: false,
      fourth: 4,
      fifth: "fifth",
    });
  });
});
