import { Context } from "react";

import { ContextManager } from "@Lib/management";
import {
  IDENTIFIER_KEY,
  CONTEXT_MANAGERS_REGISTRY,
  CONTEXT_OBSERVERS_REGISTRY,
  CONTEXT_STATES_REGISTRY
} from "@Lib/internals";
import { TAnyContextManagerConstructor } from "@Lib/types";
import { unRegisterManager } from "@Lib/registry";

import { TestContextManager, TestSingleContextManager } from "@Tests/assets";

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

  it("Should throw errors if trying to unregister not existing instance.", () => {
    expect(CONTEXT_MANAGERS_REGISTRY[TestContextManager[IDENTIFIER_KEY] as any]).toBeUndefined();
    expect(() => unRegisterManager(TestContextManager)).toThrow();
    expect(() => unRegisterManager(TestContextManager, true)).toThrow();
  });
});
