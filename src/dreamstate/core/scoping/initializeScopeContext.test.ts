import { ContextManager, DreamstateError } from "@/dreamstate";
import { initializeScopeContext } from "@/dreamstate/core/scoping/initializeScopeContext";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { TAnyObject } from "@/dreamstate/types";
import { TestManager } from "@/fixtures";

describe("InitializeScopeContext method", () => {
  it("Should properly add contextManagers subscribers", () => {
    const {
      INTERNAL: {
        registerService,
        subscribeToManager,
        unsubscribeFromManager,
        unRegisterService,
        REGISTRY: { CONTEXT_SUBSCRIBERS_REGISTRY }
      }
    }: IScopeContext = initializeScopeContext();

    const exampleSubscriber = () => {};

    registerService(TestManager);

    expect(typeof CONTEXT_SUBSCRIBERS_REGISTRY.get(TestManager)).toBe("object");
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestManager)!.size).toBe(0);

    subscribeToManager(TestManager, exampleSubscriber);

    expect(typeof CONTEXT_SUBSCRIBERS_REGISTRY.get(TestManager)).toBe("object");
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestManager)!.size).toBe(1);

    unsubscribeFromManager(TestManager, exampleSubscriber);

    expect(typeof CONTEXT_SUBSCRIBERS_REGISTRY.get(TestManager)).toBe("object");
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestManager)!.size).toBe(0);

    unRegisterService(TestManager);

    expect(typeof CONTEXT_SUBSCRIBERS_REGISTRY.get(TestManager)).toBe("object");
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestManager)!.size).toBe(0);
  });

  it("Should properly subscribe and unsubscribe only from contextManagers", () => {
    const {
      INTERNAL: { registerService, subscribeToManager, unsubscribeFromManager, unRegisterService }
    }: IScopeContext = initializeScopeContext();

    class ExampleClass {}

    class ExampleManagerClass extends ContextManager<TAnyObject> {

      public readonly context: TAnyObject = {};

    }

    const exampleSubscriber = jest.fn();

    expect(() => subscribeToManager(ExampleClass as any, exampleSubscriber)).toThrow(DreamstateError);
    expect(() => unsubscribeFromManager(ExampleClass as any, exampleSubscriber)).toThrow(DreamstateError);

    registerService(ExampleManagerClass);

    expect(() => subscribeToManager(ExampleManagerClass, exampleSubscriber)).not.toThrow();
    expect(() => unsubscribeFromManager(ExampleManagerClass, exampleSubscriber)).not.toThrow();

    unRegisterService(ExampleManagerClass);
  });

  it("Should properly get current state of managers", () => {
    const {
      INTERNAL: { registerService, unRegisterService, REGISTRY },
      getContextOf
    }: IScopeContext = initializeScopeContext();

    class ExampleManagerClass extends ContextManager<TAnyObject> {

      public readonly context: TAnyObject = {
        a: 1,
        b: 2,
        c: 3
      };

    }

    registerService(ExampleManagerClass);

    const context: TAnyObject = getContextOf(ExampleManagerClass);

    expect(context).toBeDefined();
    expect(context).not.toBeNull();
    expect(context).not.toBe(REGISTRY.CONTEXT_STATES_REGISTRY.get(ExampleManagerClass));
    expect(context).not.toBe(getContextOf(ExampleManagerClass));

    expect(context.a).toBe(1);
    expect(context.b).toBe(2);
    expect(context.c).toBe(3);

    unRegisterService(ExampleManagerClass);
  });

  it("Should properly get null for not registered managers", () => {
    const { getContextOf }: IScopeContext = initializeScopeContext();

    class ExampleManagerClass extends ContextManager<TAnyObject> {}

    expect(getContextOf(ExampleManagerClass)).toBeNull();
  });

  it("Should subscribe only with functional params for handling", () => {
    const { subscribeToSignals }: IScopeContext = initializeScopeContext();

    expect(() => subscribeToSignals(1 as any)).toThrow(DreamstateError);
    expect(() => subscribeToSignals(0 as any)).toThrow(DreamstateError);
    expect(() => subscribeToSignals("" as any)).toThrow(DreamstateError);
    expect(() => subscribeToSignals({} as any)).toThrow(DreamstateError);
    expect(() => subscribeToSignals([] as any)).toThrow(DreamstateError);
    expect(() => subscribeToSignals(new Map() as any)).toThrow(DreamstateError);
    expect(() => subscribeToSignals(Symbol("TEST") as any)).toThrow(DreamstateError);
    expect(() => subscribeToSignals(null as any)).toThrow(DreamstateError);
    expect(() => subscribeToSignals(undefined as any)).toThrow(DreamstateError);
  });

  it("Should properly return register status", () => {
    const {
      INTERNAL: { registerService, unRegisterService }
    }: IScopeContext = initializeScopeContext();

    class ExampleManagerClass extends ContextManager<TAnyObject> {}

    expect(registerService(ExampleManagerClass)).toBeTruthy();
    expect(registerService(ExampleManagerClass)).toBeFalsy();
    expect(registerService(ExampleManagerClass)).toBeFalsy();

    expect(unRegisterService(ExampleManagerClass)).toBeTruthy();
    expect(unRegisterService(ExampleManagerClass)).toBeFalsy();
    expect(unRegisterService(ExampleManagerClass)).toBeFalsy();
  });

  it("Should override context on register if required", () => {
    const {
      INTERNAL: { registerService },
      getContextOf
    }: IScopeContext = initializeScopeContext();

    class ExampleManagerClass extends ContextManager<TAnyObject> {}

    registerService(ExampleManagerClass, {}, { one: 1, two: 2 });
    expect(getContextOf(ExampleManagerClass)).toStrictEqual({ one: 1, two: 2 });

    registerService(TestManager, {}, { fourth: 4, fifth: "fifth" });
    expect(getContextOf(TestManager)).toStrictEqual({
      first: "first",
      second: 2,
      third: false,
      fourth: 4,
      fifth: "fifth"
    });
  });
});
