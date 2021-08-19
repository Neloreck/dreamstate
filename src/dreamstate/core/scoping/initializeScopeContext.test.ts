import { ContextManager } from "@/dreamstate";
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

    expect(() => subscribeToManager(ExampleClass as any, exampleSubscriber)).toThrow();
    expect(() => unsubscribeFromManager(ExampleClass as any, exampleSubscriber)).toThrow();

    registerService(ExampleManagerClass);

    expect(() => subscribeToManager(ExampleManagerClass, exampleSubscriber)).not.toThrow();
    expect(() => unsubscribeFromManager(ExampleManagerClass, exampleSubscriber)).not.toThrow();

    unRegisterService(ExampleManagerClass);
  });
});
