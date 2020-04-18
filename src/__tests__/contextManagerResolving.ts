import { Context } from "react";

import { ContextManager } from "../ContextManager";
import { IDENTIFIER_KEY } from "../internals";
import { STORE_REGISTRY } from "../registry";

describe("Context store creation test.", () => {
  class TestContextManager extends ContextManager<object> {

    public readonly context: object = {};

  }

  it("Should initialize extended class without any exceptions.", () => {
    const testContextManager = new TestContextManager();

    expect(testContextManager).toBeInstanceOf(ContextManager);
    expect(testContextManager).toBeInstanceOf(TestContextManager);

    expect(testContextManager.context).toBeInstanceOf(Object);

    // Test to detect API changes of ContextManager class.
    expect(TestContextManager["IS_SINGLETON"]).toBeFalsy();

    expect(typeof testContextManager.setContext).toBe("function");
    expect(typeof testContextManager.forceUpdate).toBe("function");
    expect(typeof testContextManager["beforeUpdate"]).toBe("function");
    expect(typeof testContextManager["afterUpdate"]).toBe("function");
    expect(typeof testContextManager["onProvisionStarted"]).toBe("function");
    expect(typeof testContextManager["onProvisionEnded"]).toBe("function");

    expect(typeof TestContextManager.getSetter).toBe("function");
    expect(typeof TestContextManager.getContextType).toBe("function");
    expect(typeof TestContextManager.currentContext).toBe("function");
    expect(typeof TestContextManager.current).toBe("function");

    expect(Object.keys(TestContextManager)).toHaveLength(0);
    expect(Object.keys(TestContextManager.prototype)).toHaveLength(1);
    expect(Object.keys(testContextManager)).toHaveLength(1);

    // Base class has all methods included.
    expect(Object.keys(ContextManager.prototype)).toHaveLength(6);
  });

  it("Context ID symbol should generate properly with registry resolving.", () => {
    const id: symbol = TestContextManager[IDENTIFIER_KEY];

    expect(typeof id).toBe("symbol");

    expect(STORE_REGISTRY.CONTEXT_OBSERVERS[id as any]).not.toBeUndefined();
    expect(STORE_REGISTRY.MANAGERS[id as any]).toBeUndefined();
    expect(typeof STORE_REGISTRY.STATES[id as any]).toBe("object"); // todo: Review if it should be object prop.
  });

  it("Related react context should be lazily initialized correctly with changed displayName.", () => {
    const contextType: Context<object> = TestContextManager.getContextType();

    expect(contextType).not.toBeUndefined();
    expect(contextType.Consumer).not.toBeUndefined();
    expect(contextType.Provider).not.toBeUndefined();
    expect(contextType.displayName).toBe("DS.TestContext");
  });
});
