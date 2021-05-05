import { ContextManager } from "@/dreamstate";
import { initializeScopeContext } from "@/dreamstate/core/scoping/initializeScopeContext";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { mockManagerWithScope } from "@/dreamstate/test-utils/registry/mockManagerWithScope";
import { TAnyObject } from "@/dreamstate/types";
import { TestContextManager } from "@/fixtures";

describe("InitializeScopeContext method", () => {
  it("Should properly add contextManagers subscribers", () => {
    const {
      registerService, subscribeToManager, unsubscribeFromManager, unRegisterService,
      REGISTRY: { CONTEXT_SUBSCRIBERS_REGISTRY }
    }: IScopeContext = initializeScopeContext();

    const exampleSubscriber = () => {};

    registerService(TestContextManager);

    expect(typeof CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)).toBe("object");
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)!.size).toBe(0);

    subscribeToManager(TestContextManager, exampleSubscriber);

    expect(typeof CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)).toBe("object");
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)!.size).toBe(1);

    unsubscribeFromManager(TestContextManager, exampleSubscriber);

    expect(typeof CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)).toBe("object");
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)!.size).toBe(0);

    unRegisterService(TestContextManager);

    expect(typeof CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)).toBe("object");
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)!.size).toBe(0);
  });

  it("Should properly subscribe and unsubscribe only from contextManagers", () => {
    const {
      registerService, subscribeToManager, unsubscribeFromManager, unRegisterService
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

  it("Should correctly change computed values beforeUpdate", () => {
    interface IExampleContext {
      a: number;
      b: number;
    }

    class ExampleManagerClass extends ContextManager<IExampleContext> {

      public readonly context: IExampleContext = {
        a: 5,
        b: 10
      };

      protected beforeUpdate(nextContext: IExampleContext) {
        nextContext.b = nextContext.a * 2;
      }

    }

    const [ manager ] = mockManagerWithScope(ExampleManagerClass);

    manager.setContext({ a: 200 });

    expect(manager.context.b).toBe(400);

    manager.setContext({ a: 400 });

    expect(manager.context.b).toBe(800);
  });
});
