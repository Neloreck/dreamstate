import { IDENTIFIER_KEY, CONTEXT_MANAGERS_REGISTRY } from "../src/internals";
import {
  addManagerObserverToRegistry, getCurrentContext, getCurrentManager,
  removeManagerObserverFromRegistry, subscribeToManager,
  unsubscribeFromManager
} from "../src/registry";

import { nextAsyncQuery, registerManagerClass, unRegisterManagerClass } from "./helpers";
import { ExtendingTestContextManager, ITestContext, TestContextManager, TestSingleContextManager } from "./assets";
import { ContextManager } from "../src/management";

describe("Context store creation tests.", () => {
  it("Should properly handle onProvisionStarted and onProvision ended for context managers.", () => {
    expect(CONTEXT_MANAGERS_REGISTRY[TestContextManager[IDENTIFIER_KEY] as any]).toBeUndefined();
    expect(CONTEXT_MANAGERS_REGISTRY[TestSingleContextManager[IDENTIFIER_KEY] as any]).toBeUndefined();

    const testManager: TestContextManager = registerManagerClass(TestContextManager);
    const testSingleManager: TestSingleContextManager = registerManagerClass(TestSingleContextManager);

    const firstObserver: jest.Mock<any> = jest.fn();
    const secondObserver: jest.Mock<any> = jest.fn();

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

    expect(CONTEXT_MANAGERS_REGISTRY[TestContextManager[IDENTIFIER_KEY] as any]).toBeDefined();
    expect(CONTEXT_MANAGERS_REGISTRY[TestSingleContextManager[IDENTIFIER_KEY] as any]).toBeDefined();

    addManagerObserverToRegistry(TestContextManager, firstObserver);

    expect(testManager["onProvisionStarted"]).toBeCalled();
    expect(testManager["onProvisionEnded"]).not.toBeCalled();
    expect(CONTEXT_MANAGERS_REGISTRY[TestSingleContextManager[IDENTIFIER_KEY] as any]).toBeDefined();
    clearMocks();

    addManagerObserverToRegistry(TestContextManager, secondObserver);
    expect(testManager["onProvisionStarted"]).not.toBeCalled();
    expect(testManager["onProvisionEnded"]).not.toBeCalled();
    expect(CONTEXT_MANAGERS_REGISTRY[TestContextManager[IDENTIFIER_KEY] as any]).toBeDefined();
    clearMocks();

    removeManagerObserverFromRegistry(TestContextManager, secondObserver);

    expect(testManager["onProvisionStarted"]).not.toBeCalled();
    expect(testManager["onProvisionEnded"]).not.toBeCalled();
    expect(CONTEXT_MANAGERS_REGISTRY[TestContextManager[IDENTIFIER_KEY] as any]).toBeDefined();
    clearMocks();

    removeManagerObserverFromRegistry(TestContextManager, firstObserver);

    expect(testManager["onProvisionStarted"]).not.toBeCalled();
    expect(testManager["onProvisionEnded"]).toBeCalled();
    expect(CONTEXT_MANAGERS_REGISTRY[TestContextManager[IDENTIFIER_KEY] as any]).toBeUndefined();
    clearMocks();

    /**
     * Singleton managers should not destroy after provision end.
     * Singleton managers should be created after first use only.
     */

    addManagerObserverToRegistry(TestSingleContextManager, firstObserver);

    expect(testSingleManager["onProvisionStarted"]).toBeCalled();
    expect(testSingleManager["onProvisionEnded"]).not.toBeCalled();
    expect(CONTEXT_MANAGERS_REGISTRY[TestSingleContextManager[IDENTIFIER_KEY] as any]).toBeDefined();
    clearMocks();

    removeManagerObserverFromRegistry(TestSingleContextManager, firstObserver);

    expect(testSingleManager["onProvisionStarted"]).not.toBeCalled();
    expect(testSingleManager["onProvisionEnded"]).toBeCalled();
    expect(CONTEXT_MANAGERS_REGISTRY[TestSingleContextManager[IDENTIFIER_KEY] as any]).toBeDefined();
    clearMocks();
  });

  it("Should properly handle setContext and forceUpdate method update with prev/next props.", () => {
    const manager: TestContextManager = new TestContextManager();

    manager["beforeUpdate"] = jest.fn(function (this: TestContextManager, nextContext: ITestContext) {
      expect(nextContext.first).toBe("updated");
      expect(nextContext.second).toBe(22);
      expect(this.context.first).toBe("first");
      expect(this.context.second).toBe(2);
    }.bind(manager));
    manager["afterUpdate"] = jest.fn(function (this: TestContextManager, prevContext: ITestContext) {
      expect(this.context.first).toBe("updated");
      expect(this.context.second).toBe(22);
      expect(prevContext.first).toBe("first");
      expect(prevContext.second).toBe(2);
    }.bind(manager));

    expect(manager.context.first).toBe("first");
    expect(manager.context.second).toBe(2);

    manager.setContext({ first: "updated", second: 22 });

    expect(manager["beforeUpdate"]).toBeCalled();
    expect(manager["afterUpdate"]).toBeCalled();

    expect(manager.context.first).toBe("updated");
    expect(manager.context.second).toBe(22);

    /**
     * Should not update if props are not changed.
     */

    manager["beforeUpdate"] = jest.fn();
    manager["afterUpdate"] = jest.fn();

    manager.setContext({ first: "updated", second: 22 });

    expect(manager["beforeUpdate"]).not.toBeCalled();
    expect(manager["afterUpdate"]).not.toBeCalled();

    /**
     * Should force updates correctly.
     */

    manager["beforeUpdate"] = jest.fn(function (this: TestContextManager, nextContext: ITestContext) {
      expect(nextContext.first).toBe("updated");
      expect(nextContext.second).toBe(22);
      expect(this.context.first).toBe("updated");
      expect(this.context.second).toBe(22);
    }.bind(manager));
    manager["afterUpdate"] = jest.fn(function (this: TestContextManager, prevContext: ITestContext) {
      expect(this.context.first).toBe("updated");
      expect(this.context.second).toBe(22);
      expect(prevContext.first).toBe("updated");
      expect(prevContext.second).toBe(22);
    }.bind(manager));

    manager.forceUpdate();

    expect(manager["beforeUpdate"]).toBeCalled();
    expect(manager["afterUpdate"]).toBeCalled();
  });

  it("Should properly subscribe to manager and unsubscribe.", async () => {
    const manager: TestContextManager = registerManagerClass(TestContextManager);

    const initialMockFn = jest.fn();
    const withCheckParamsMockFn = jest.fn((context: ITestContext) => {
      expect(context.first).toBe("example");
      expect(context.second).toBe(100);
    });

    subscribeToManager(TestContextManager, initialMockFn, true);
    subscribeToManager(TestContextManager, withCheckParamsMockFn);

    expect(initialMockFn).toBeCalledWith(manager.context);
    expect(withCheckParamsMockFn).not.toBeCalled();

    initialMockFn.mockClear();

    manager.setContext(({ first: "example", second: 100 }));

    await nextAsyncQuery();

    expect(initialMockFn).toBeCalled();
    expect(initialMockFn).toBeCalled();

    initialMockFn.mockClear();

    unsubscribeFromManager(TestContextManager, withCheckParamsMockFn);
    unsubscribeFromManager(TestContextManager, initialMockFn);

    manager.setContext(({ first: "d", second: 35 }));

    await nextAsyncQuery();
    expect(initialMockFn).not.toBeCalled();

    unRegisterManagerClass(TestContextManager);
  });

  it("Should correctly register context and get current context/manager.", () => {
    expect(getCurrentManager(TestContextManager)).toBeNull();
    expect(getCurrentContext(TestContextManager)).toBeNull();

    registerManagerClass(TestContextManager);

    expect(getCurrentManager(TestContextManager)).not.toBeNull();
    expect(getCurrentContext(TestContextManager)).not.toBeNull();

    unRegisterManagerClass(TestContextManager);

    expect(getCurrentManager(TestContextManager)).toBeNull();
    expect(getCurrentContext(TestContextManager)).toBeNull();
  });

  it("Should correctly create new managers after provision restart.", () => {
    registerManagerClass(TestContextManager);

    getCurrentManager(TestContextManager)!.setContext({ first: "15", second: 15 });

    expect(getCurrentContext(TestContextManager)!.first).toBe("15");
    expect(getCurrentContext(TestContextManager)!.second).toBe(15);

    unRegisterManagerClass(TestContextManager);

    registerManagerClass(TestContextManager);

    expect(getCurrentContext(TestContextManager)!.first).toBe("first");
    expect(getCurrentContext(TestContextManager)!.second).toBe(2);

    unRegisterManagerClass(TestContextManager);
  });

  it("Should correctly save singleton managers state after provision restart and force unregister.", () => {
    registerManagerClass(TestSingleContextManager);

    getCurrentManager(TestSingleContextManager)!.setContext({ first: "15", second: 15 });

    expect(getCurrentContext(TestSingleContextManager)!.first).toBe("15");
    expect(getCurrentContext(TestSingleContextManager)!.second).toBe(15);

    unRegisterManagerClass(TestSingleContextManager);

    registerManagerClass(TestSingleContextManager);

    expect(getCurrentContext(TestSingleContextManager)!.first).toBe("15");
    expect(getCurrentContext(TestSingleContextManager)!.second).toBe(15);

    unRegisterManagerClass(TestSingleContextManager, true);

    registerManagerClass(TestSingleContextManager);

    expect(getCurrentContext(TestSingleContextManager)!.first).toBe("first");
    expect(getCurrentContext(TestSingleContextManager)!.second).toBe(2);

    unRegisterManagerClass(TestSingleContextManager, true);
  });

  it("Should not allow base class identifier and REACT_CONTEXT.", () => {
    expect(() => ContextManager[IDENTIFIER_KEY]).toThrow(Error);
    expect(() => ContextManager.REACT_CONTEXT).toThrow(Error);
  });

  // todo: Think about inheritance there.
  xit("Should properly manage extended managers.", () => {
    expect(TestContextManager[IDENTIFIER_KEY]).not.toBe(ExtendingTestContextManager[IDENTIFIER_KEY]);

    expect(getCurrentManager(ExtendingTestContextManager)).toBeNull();
    expect(getCurrentManager(TestContextManager)).toBeNull();

    registerManagerClass(TestContextManager);

    expect(getCurrentManager(TestContextManager)).not.toBeNull();
    expect(getCurrentManager(ExtendingTestContextManager)).toBeNull();

    registerManagerClass(ExtendingTestContextManager);

    expect(getCurrentManager(TestContextManager)).not.toBeNull();
    expect(getCurrentManager(ExtendingTestContextManager)).not.toBeNull();
    expect(getCurrentManager(TestContextManager)).not.toBe(getCurrentManager(ExtendingTestContextManager));

    unRegisterManagerClass(TestContextManager);
    unRegisterManagerClass(ExtendingTestContextManager);
  });
});
