import {
  CONTEXT_REACT_CONTEXTS_REGISTRY,
  CONTEXT_SUBSCRIBERS_REGISTRY,
  CONTEXT_SERVICES_REGISTRY
} from "@Lib/core/internals";
import { ContextManager } from "@Lib/core/management/ContextManager";
import { getCurrent } from "@Lib/core/registry/getCurrent";
import { getCurrentContext } from "@Lib/core/registry/getCurrentContext";
import { getReactContext } from "@Lib/core/registry/getReactContext";
import { subscribeToManager } from "@Lib/core/registry/subscribeToManager";
import { unsubscribeFromManager } from "@Lib/core/registry/unSubscribeFromManager";
import {
  ExampleContextManager,
  ExtendingTestContextManager,
  ITestContext,
  TestContextManager
} from "@Lib/fixtures";
import { registerService } from "@Lib/test-utils/registry/registerService";
import { unRegisterService } from "@Lib/test-utils/registry/unRegisterService";

describe("ContextManager class.", () => {
  it("Should not allow base class REACT_CONTEXT.", () => {
    expect(() => ContextManager.REACT_CONTEXT).toThrow(Error);
  });

  it("Should properly handle setContext and forceUpdate method update with prev/next props.", () => {
    const manager: TestContextManager = registerService(TestContextManager);

    manager["beforeUpdate"] = jest.fn(
      function(this: TestContextManager, nextContext: ITestContext) {
        expect(nextContext.first).toBe("updated");
        expect(nextContext.second).toBe(22);
        expect(this.context.first).toBe("first");
        expect(this.context.second).toBe(2);
      }.bind(manager)
    );
    manager["afterUpdate"] = jest.fn(
      function(this: TestContextManager, prevContext: ITestContext) {
        expect(this.context.first).toBe("updated");
        expect(this.context.second).toBe(22);
        expect(prevContext.first).toBe("first");
        expect(prevContext.second).toBe(2);
      }.bind(manager)
    );

    expect(manager.context.first).toBe("first");
    expect(manager.context.second).toBe(2);

    manager.setContext(() => ({ first: "updated", second: 22 }));

    expect(manager["beforeUpdate"]).toHaveBeenCalled();
    expect(manager["afterUpdate"]).toHaveBeenCalled();

    expect(manager.context.first).toBe("updated");
    expect(manager.context.second).toBe(22);

    /**
     * Should not update if props are not changed.
     */

    manager["beforeUpdate"] = jest.fn();
    manager["afterUpdate"] = jest.fn();

    manager.setContext({ first: "updated", second: 22 });

    expect(manager["beforeUpdate"]).not.toHaveBeenCalled();
    expect(manager["afterUpdate"]).not.toHaveBeenCalled();

    /**
     * Should force updates correctly.
     */

    manager["beforeUpdate"] = jest.fn(
      function(this: TestContextManager, nextContext: ITestContext) {
        expect(nextContext.first).toBe("updated");
        expect(nextContext.second).toBe(22);
        expect(this.context.first).toBe("updated");
        expect(this.context.second).toBe(22);
      }.bind(manager)
    );
    manager["afterUpdate"] = jest.fn(
      function(this: TestContextManager, prevContext: ITestContext) {
        expect(this.context.first).toBe("updated");
        expect(this.context.second).toBe(22);
        expect(prevContext.first).toBe("updated");
        expect(prevContext.second).toBe(22);
      }.bind(manager)
    );

    manager.forceUpdate();

    expect(manager["beforeUpdate"]).toHaveBeenCalled();
    expect(manager["afterUpdate"]).toHaveBeenCalled();

    unRegisterService(TestContextManager);
  });

  it("Should correctly register context and get current context/manager.", () => {
    expect(getCurrent(TestContextManager)).toBeNull();
    expect(getCurrentContext(TestContextManager)).toBeNull();

    registerService(TestContextManager);

    expect(getCurrent(TestContextManager)).not.toBeNull();
    expect(getCurrentContext(TestContextManager)).not.toBeNull();

    unRegisterService(TestContextManager);

    expect(getCurrent(TestContextManager)).toBeNull();
    expect(getCurrentContext(TestContextManager)).toBeNull();
  });

  it("Should correctly create new managers after provision restart.", () => {
    registerService(TestContextManager);

    getCurrent(TestContextManager)!.setContext({
      first: "15",
      second: 15
    });

    expect(getCurrentContext(TestContextManager)!.first).toBe("15");
    expect(getCurrentContext(TestContextManager)!.second).toBe(15);

    unRegisterService(TestContextManager);

    registerService(TestContextManager);

    expect(getCurrentContext(TestContextManager)!.first).toBe("first");
    expect(getCurrentContext(TestContextManager)!.second).toBe(2);

    unRegisterService(TestContextManager);
  });

  it("Should properly manage extended managers.", () => {
    expect(getCurrent(ExtendingTestContextManager)).toBeNull();
    expect(getCurrent(TestContextManager)).toBeNull();

    registerService(TestContextManager);

    expect(getCurrent(TestContextManager)).not.toBeNull();
    expect(getCurrent(ExtendingTestContextManager)).toBeNull();

    registerService(ExtendingTestContextManager);

    expect(getCurrent(TestContextManager)).not.toBeNull();
    expect(getCurrent(ExtendingTestContextManager)).not.toBeNull();
    expect(getCurrent(TestContextManager)).not.toBe(getCurrent(ExtendingTestContextManager));
    expect(getCurrentContext(TestContextManager)).not.toBe(getCurrentContext(ExtendingTestContextManager));

    expect(CONTEXT_SERVICES_REGISTRY.has(TestContextManager)).toBeTruthy();
    expect(CONTEXT_SERVICES_REGISTRY.has(ExtendingTestContextManager)).toBeTruthy();

    unRegisterService(TestContextManager);
    unRegisterService(ExtendingTestContextManager);

    expect(CONTEXT_SERVICES_REGISTRY.has(TestContextManager)).toBeFalsy();
    expect(CONTEXT_SERVICES_REGISTRY.has(ExtendingTestContextManager)).toBeFalsy();
  });

  it("Should properly add contextManagers subscribers.", () => {
    const exampleSubscriber = () => {};

    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(ExampleContextManager)).toBeUndefined();

    registerService(ExampleContextManager);

    expect(typeof CONTEXT_SUBSCRIBERS_REGISTRY.get(ExampleContextManager)).toBe("object");
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(ExampleContextManager)!.size).toBe(0);

    subscribeToManager(ExampleContextManager, exampleSubscriber);

    expect(typeof CONTEXT_SUBSCRIBERS_REGISTRY.get(ExampleContextManager)).toBe("object");
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(ExampleContextManager)!.size).toBe(1);

    unsubscribeFromManager(ExampleContextManager, exampleSubscriber);

    expect(typeof CONTEXT_SUBSCRIBERS_REGISTRY.get(ExampleContextManager)).toBe("object");
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(ExampleContextManager)!.size).toBe(0);

    unRegisterService(ExampleContextManager);

    expect(typeof CONTEXT_SUBSCRIBERS_REGISTRY.get(ExampleContextManager)).toBe("object");
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(ExampleContextManager)!.size).toBe(0);
  });

  it("Should properly subscribe and unsubscribe only from contextManagers", () => {
    class ExampleClass {}

    class ExampleManagerClass extends ContextManager<object> {

      public readonly context: object = {};

    }

    const exampleSubscriber = jest.fn();

    expect(() => subscribeToManager(ExampleClass as any, exampleSubscriber)).toThrow();
    expect(() => unsubscribeFromManager(ExampleClass as any, exampleSubscriber)).toThrow();

    registerService(ExampleManagerClass);

    expect(() => subscribeToManager(ExampleManagerClass, exampleSubscriber)).not.toThrow();
    expect(() => unsubscribeFromManager(ExampleManagerClass, exampleSubscriber)).not.toThrow();

    unRegisterService(ExampleManagerClass);
  });

  it("Should use getReactContext for REACT_CONTEXT and return same result.", () => {
    expect(getReactContext(ExampleContextManager)).toBe(ExampleContextManager.REACT_CONTEXT);
    CONTEXT_REACT_CONTEXTS_REGISTRY.delete(ExampleContextManager);
  });
});
