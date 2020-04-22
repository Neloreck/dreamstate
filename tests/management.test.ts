import { Context } from "react";

import { ContextManager } from "../src/management";
import { IDENTIFIER_KEY, CONTEXT_MANAGERS_REGISTRY, CONTEXT_OBSERVERS_REGISTRY, CONTEXT_STATES_REGISTRY } from "../src/internals";
import { addManagerObserverToRegistry, removeManagerObserverFromRegistry } from "../src/registry";
import { TAnyContextManagerConstructor } from "../src/types";

import { registerManagerClass } from "./helpers";
import { ITestContext, TestContextManager, TestSingleContextManager } from "./assets";

describe("Context store creation tests.", () => {
  it("Should initialize extended class without any exceptions.", () => {
    const testContextManagerInit = (ManagerConstructor: TAnyContextManagerConstructor, isSingle: boolean = false) => {
      const manager = new ManagerConstructor();

      expect(manager).toBeInstanceOf(ContextManager);
      expect(manager).toBeInstanceOf(ManagerConstructor);

      expect(manager.context).toBeInstanceOf(Object);

      // @ts-ignore Test to detect API changes of ContextManager class.
      expect(ManagerConstructor["IS_SINGLE"]).toBe(isSingle);

      expect(typeof manager.setContext).toBe("function");
      expect(typeof manager.forceUpdate).toBe("function");
      expect(typeof manager["beforeUpdate"]).toBe("function");
      expect(typeof manager["afterUpdate"]).toBe("function");
      expect(typeof manager["onProvisionStarted"]).toBe("function");
      expect(typeof manager["onProvisionEnded"]).toBe("function");

      expect(typeof ManagerConstructor.REACT_CONTEXT).toBe("object");
      expect(typeof ManagerConstructor.REACT_CONTEXT.Provider).toBe("object");
      expect(typeof ManagerConstructor.REACT_CONTEXT.Consumer).toBe("object");

      expect(Object.keys(ManagerConstructor)).toHaveLength(isSingle ? 1 : 0);
      expect(Object.keys(ManagerConstructor.prototype)).toHaveLength(0);
      expect(Object.keys(manager)).toHaveLength(1);
    };

    expect(Object.keys(ContextManager.prototype)).toHaveLength(0);

    testContextManagerInit(TestContextManager);
    testContextManagerInit(TestSingleContextManager, true);
  });

  it("Context ID symbol should generate properly with registry resolving.", () => {
    const id: symbol = TestContextManager[IDENTIFIER_KEY];

    expect(typeof id).toBe("symbol");

    expect(CONTEXT_OBSERVERS_REGISTRY[id as any]).not.toBeUndefined();
    expect(CONTEXT_MANAGERS_REGISTRY[id as any]).toBeUndefined();
    expect(typeof CONTEXT_STATES_REGISTRY[id as any]).toBe("object");
  });

  it("Related react context should be lazily initialized correctly with changed displayName.", () => {
    const contextType: Context<object> = TestContextManager.REACT_CONTEXT;

    expect(contextType).not.toBeUndefined();
    expect(contextType.Consumer).not.toBeUndefined();
    expect(contextType.Provider).not.toBeUndefined();
    expect(contextType.displayName).toBe("DS.TestContext");
  });

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
});
