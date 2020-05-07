import {
  getCurrentContext,
  getCurrent,
  subscribeToManager,
  unsubscribeFromManager
} from "../registry";
import { CONTEXT_SUBSCRIBERS_REGISTRY, CONTEXT_WORKERS_REGISTRY } from "../internals";
import { ContextManager } from "./ContextManager";
import { nextAsyncQueue, registerWorker, unRegisterWorker } from "../test-utils";

import {
  ExampleContextManager,
  ExtendingTestContextManager,
  ITestContext,
  TestContextManager,
} from "@Tests/assets";

describe("ContextManager class.", () => {

  it("Should not allow base class REACT_CONTEXT.", () => {
    expect(() => ContextManager.REACT_CONTEXT).toThrow(Error);
  });

  it("Should properly handle setContext and forceUpdate method update with prev/next props.", () => {
    const manager: TestContextManager = registerWorker(TestContextManager);

    manager["beforeUpdate"] = jest.fn(
      function (this: TestContextManager, nextContext: ITestContext) {
        expect(nextContext.first).toBe("updated");
        expect(nextContext.second).toBe(22);
        expect(this.context.first).toBe("first");
        expect(this.context.second).toBe(2);
      }.bind(manager)
    );
    manager["afterUpdate"] = jest.fn(
      function (this: TestContextManager, prevContext: ITestContext) {
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
      function (this: TestContextManager, nextContext: ITestContext) {
        expect(nextContext.first).toBe("updated");
        expect(nextContext.second).toBe(22);
        expect(this.context.first).toBe("updated");
        expect(this.context.second).toBe(22);
      }.bind(manager)
    );
    manager["afterUpdate"] = jest.fn(
      function (this: TestContextManager, prevContext: ITestContext) {
        expect(this.context.first).toBe("updated");
        expect(this.context.second).toBe(22);
        expect(prevContext.first).toBe("updated");
        expect(prevContext.second).toBe(22);
      }.bind(manager)
    );

    manager.forceUpdate();

    expect(manager["beforeUpdate"]).toHaveBeenCalled();
    expect(manager["afterUpdate"]).toHaveBeenCalled();

    unRegisterWorker(TestContextManager);
  });

  it("Should properly subscribe to manager and unsubscribe.", async () => {
    const manager: TestContextManager = registerWorker(TestContextManager);

    const initialMockFn = jest.fn();
    const withCheckParamsMockFn = jest.fn((context: ITestContext) => {
      expect(context.first).toBe("example");
      expect(context.second).toBe(100);
    });

    subscribeToManager(TestContextManager, initialMockFn, true);
    subscribeToManager(TestContextManager, withCheckParamsMockFn);

    expect(initialMockFn).toHaveBeenCalledWith(manager.context);
    expect(withCheckParamsMockFn).not.toHaveBeenCalled();

    initialMockFn.mockClear();

    manager.setContext({ first: "example", second: 100 });

    await nextAsyncQueue();

    expect(initialMockFn).toHaveBeenCalled();
    expect(initialMockFn).toHaveBeenCalled();

    initialMockFn.mockClear();

    unsubscribeFromManager(TestContextManager, withCheckParamsMockFn);
    unsubscribeFromManager(TestContextManager, initialMockFn);

    manager.setContext({ first: "d", second: 35 });

    await nextAsyncQueue();
    expect(initialMockFn).not.toHaveBeenCalled();

    unRegisterWorker(TestContextManager);
  });

  it("Should correctly register context and get current context/manager.", () => {
    expect(getCurrent(TestContextManager)).toBeNull();
    expect(getCurrentContext(TestContextManager)).toBeNull();

    registerWorker(TestContextManager);

    expect(getCurrent(TestContextManager)).not.toBeNull();
    expect(getCurrentContext(TestContextManager)).not.toBeNull();

    unRegisterWorker(TestContextManager);

    expect(getCurrent(TestContextManager)).toBeNull();
    expect(getCurrentContext(TestContextManager)).toBeNull();
  });

  it("Should correctly create new managers after provision restart.", () => {
    registerWorker(TestContextManager);

    getCurrent(TestContextManager)!.setContext({
      first: "15",
      second: 15
    });

    expect(getCurrentContext(TestContextManager)!.first).toBe("15");
    expect(getCurrentContext(TestContextManager)!.second).toBe(15);

    unRegisterWorker(TestContextManager);

    registerWorker(TestContextManager);

    expect(getCurrentContext(TestContextManager)!.first).toBe("first");
    expect(getCurrentContext(TestContextManager)!.second).toBe(2);

    unRegisterWorker(TestContextManager);
  });

  it("Should properly manage extended managers.", () => {
    expect(getCurrent(ExtendingTestContextManager)).toBeNull();
    expect(getCurrent(TestContextManager)).toBeNull();

    registerWorker(TestContextManager);

    expect(getCurrent(TestContextManager)).not.toBeNull();
    expect(getCurrent(ExtendingTestContextManager)).toBeNull();

    registerWorker(ExtendingTestContextManager);

    expect(getCurrent(TestContextManager)).not.toBeNull();
    expect(getCurrent(ExtendingTestContextManager)).not.toBeNull();
    expect(getCurrent(TestContextManager)).not.toBe(getCurrent(ExtendingTestContextManager));
    expect(getCurrentContext(TestContextManager)).not.toBe(getCurrentContext(ExtendingTestContextManager));

    expect(CONTEXT_WORKERS_REGISTRY.has(TestContextManager)).toBeTruthy();
    expect(CONTEXT_WORKERS_REGISTRY.has(ExtendingTestContextManager)).toBeTruthy();

    unRegisterWorker(TestContextManager);
    unRegisterWorker(ExtendingTestContextManager);

    expect(CONTEXT_WORKERS_REGISTRY.has(TestContextManager)).toBeFalsy();
    expect(CONTEXT_WORKERS_REGISTRY.has(ExtendingTestContextManager)).toBeFalsy();
  });

  it("Should properly add contextManagers subscribers.", () => {
    const exampleSubscriber = () => {};

    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(ExampleContextManager)).toBeUndefined();

    registerWorker(ExampleContextManager);

    expect(typeof CONTEXT_SUBSCRIBERS_REGISTRY.get(ExampleContextManager)).toBe("object");
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(ExampleContextManager)!.size).toBe(0);

    subscribeToManager(ExampleContextManager, exampleSubscriber);

    expect(typeof CONTEXT_SUBSCRIBERS_REGISTRY.get(ExampleContextManager)).toBe("object");
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(ExampleContextManager)!.size).toBe(1);

    unsubscribeFromManager(ExampleContextManager, exampleSubscriber);

    expect(typeof CONTEXT_SUBSCRIBERS_REGISTRY.get(ExampleContextManager)).toBe("object");
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(ExampleContextManager)!.size).toBe(0);

    unRegisterWorker(ExampleContextManager);

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

    registerWorker(ExampleManagerClass);

    expect(() => subscribeToManager(ExampleManagerClass, exampleSubscriber)).not.toThrow();
    expect(() => unsubscribeFromManager(ExampleManagerClass, exampleSubscriber)).not.toThrow();

    unRegisterWorker(ExampleManagerClass);
  });
});
