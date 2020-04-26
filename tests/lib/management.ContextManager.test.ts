import { CONTEXT_WORKERS_REGISTRY } from "@Lib/internals";
import {
  addWorkerObserverToRegistry,
  getCurrentContext,
  getCurrent,
  removeWorkerObserverFromRegistry,
  subscribeToManager,
  unsubscribeFromManager
} from "@Lib/registry";
import { ContextManager } from "@Lib/management";

import { nextAsyncQueue, registerWorkerClass, unRegisterWorkerClass } from "@Tests/helpers";
import { ExtendingTestContextManager, ITestContext, TestContextManager, TestSingleContextManager } from "@Tests/assets";

describe("Context store creation tests.", () => {
  it("Should properly handle onProvisionStarted and onProvision ended for context managers.", () => {
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestSingleContextManager)).toBeUndefined();

    const testManager: TestContextManager = registerWorkerClass(TestContextManager);
    const testSingleManager: TestSingleContextManager = registerWorkerClass(TestSingleContextManager);

    const firstObserver: jest.Mock = jest.fn();
    const secondObserver: jest.Mock = jest.fn();

    testManager["onProvisionStarted"] = jest.fn();
    testManager["onProvisionEnded"] = jest.fn();
    testSingleManager["onProvisionStarted"] = jest.fn();
    testSingleManager["onProvisionEnded"] = jest.fn();

    const clearMocks = () => {
      firstObserver.mockClear();
      secondObserver.mockClear();
      (testManager["onProvisionStarted"] as jest.Mocked<any>).mockClear();
      (testManager["onProvisionEnded"] as jest.Mocked<any>).mockClear();
      (testSingleManager["onProvisionStarted"] as jest.Mocked<any>).mockClear();
      (testSingleManager["onProvisionEnded"] as jest.Mocked<any>).mockClear();
    };

    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestSingleContextManager)).toBeDefined();

    addWorkerObserverToRegistry(TestContextManager, firstObserver);

    expect(testManager["onProvisionStarted"]).toHaveBeenCalled();
    expect(testManager["onProvisionEnded"]).not.toHaveBeenCalled();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestSingleContextManager)).toBeDefined();
    clearMocks();

    addWorkerObserverToRegistry(TestContextManager, secondObserver);
    expect(testManager["onProvisionStarted"]).not.toHaveBeenCalled();
    expect(testManager["onProvisionEnded"]).not.toHaveBeenCalled();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextManager)).toBeDefined();
    clearMocks();

    removeWorkerObserverFromRegistry(TestContextManager, secondObserver);

    expect(testManager["onProvisionStarted"]).not.toHaveBeenCalled();
    expect(testManager["onProvisionEnded"]).not.toHaveBeenCalled();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextManager)).toBeDefined();
    clearMocks();

    removeWorkerObserverFromRegistry(TestContextManager, firstObserver);

    expect(testManager["onProvisionStarted"]).not.toHaveBeenCalled();
    expect(testManager["onProvisionEnded"]).toHaveBeenCalled();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    clearMocks();

    /**
     * Singleton managers should not destroy after provision end.
     * Singleton managers should be created after first use only.
     */

    addWorkerObserverToRegistry(TestSingleContextManager, firstObserver);

    expect(testSingleManager["onProvisionStarted"]).toHaveBeenCalled();
    expect(testSingleManager["onProvisionEnded"]).not.toHaveBeenCalled();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestSingleContextManager)).toBeDefined();
    clearMocks();

    removeWorkerObserverFromRegistry(TestSingleContextManager, firstObserver);

    expect(testSingleManager["onProvisionStarted"]).not.toHaveBeenCalled();
    expect(testSingleManager["onProvisionEnded"]).toHaveBeenCalled();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestSingleContextManager)).toBeDefined();
    clearMocks();

    unRegisterWorkerClass(TestSingleContextManager, true);
  });

  it("Should properly handle setContext and forceUpdate method update with prev/next props.", () => {
    const manager: TestContextManager = registerWorkerClass(TestContextManager);

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

    unRegisterWorkerClass(TestContextManager);
  });

  it("Should properly subscribe to manager and unsubscribe.", async () => {
    const manager: TestContextManager = registerWorkerClass(TestContextManager);

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

    unRegisterWorkerClass(TestContextManager);
  });

  it("Should correctly register context and get current context/manager.", () => {
    expect(getCurrent(TestContextManager)).toBeNull();
    expect(getCurrentContext(TestContextManager)).toBeNull();

    registerWorkerClass(TestContextManager);

    expect(getCurrent(TestContextManager)).not.toBeNull();
    expect(getCurrentContext(TestContextManager)).not.toBeNull();

    unRegisterWorkerClass(TestContextManager);

    expect(getCurrent(TestContextManager)).toBeNull();
    expect(getCurrentContext(TestContextManager)).toBeNull();
  });

  it("Should correctly create new managers after provision restart.", () => {
    registerWorkerClass(TestContextManager);

    getCurrent(TestContextManager)!.setContext({
      first: "15",
      second: 15
    });

    expect(getCurrentContext(TestContextManager)!.first).toBe("15");
    expect(getCurrentContext(TestContextManager)!.second).toBe(15);

    unRegisterWorkerClass(TestContextManager);

    registerWorkerClass(TestContextManager);

    expect(getCurrentContext(TestContextManager)!.first).toBe("first");
    expect(getCurrentContext(TestContextManager)!.second).toBe(2);

    unRegisterWorkerClass(TestContextManager);
  });

  it("Should correctly save singleton managers state after provision restart and force unregister.", () => {
    registerWorkerClass(TestSingleContextManager);

    getCurrent(TestSingleContextManager)!.setContext({
      first: "15",
      second: 15
    });

    expect(getCurrentContext(TestSingleContextManager)!.first).toBe("15");
    expect(getCurrentContext(TestSingleContextManager)!.second).toBe(15);

    unRegisterWorkerClass(TestSingleContextManager);

    registerWorkerClass(TestSingleContextManager);

    expect(getCurrentContext(TestSingleContextManager)!.first).toBe("15");
    expect(getCurrentContext(TestSingleContextManager)!.second).toBe(15);

    unRegisterWorkerClass(TestSingleContextManager, true);

    registerWorkerClass(TestSingleContextManager);

    expect(getCurrentContext(TestSingleContextManager)!.first).toBe("first");
    expect(getCurrentContext(TestSingleContextManager)!.second).toBe(2);

    unRegisterWorkerClass(TestSingleContextManager, true);
  });

  it("Should not allow base class identifier and REACT_CONTEXT.", () => {
    expect(() => ContextManager.REACT_CONTEXT).toThrow(Error);
  });

  it("Should properly manage extended managers.", () => {
    expect(getCurrent(ExtendingTestContextManager)).toBeNull();
    expect(getCurrent(TestContextManager)).toBeNull();

    registerWorkerClass(TestContextManager);

    expect(getCurrent(TestContextManager)).not.toBeNull();
    expect(getCurrent(ExtendingTestContextManager)).toBeNull();

    registerWorkerClass(ExtendingTestContextManager);

    expect(getCurrent(TestContextManager)).not.toBeNull();
    expect(getCurrent(ExtendingTestContextManager)).not.toBeNull();
    expect(getCurrent(TestContextManager)).not.toBe(getCurrent(ExtendingTestContextManager));
    expect(getCurrentContext(TestContextManager)).not.toBe(getCurrentContext(ExtendingTestContextManager));

    expect(CONTEXT_WORKERS_REGISTRY.has(TestContextManager)).toBeTruthy();
    expect(CONTEXT_WORKERS_REGISTRY.has(ExtendingTestContextManager)).toBeTruthy();

    unRegisterWorkerClass(TestContextManager);
    unRegisterWorkerClass(ExtendingTestContextManager);

    expect(CONTEXT_WORKERS_REGISTRY.has(TestContextManager)).toBeFalsy();
    expect(CONTEXT_WORKERS_REGISTRY.has(ExtendingTestContextManager)).toBeFalsy();
  });
});