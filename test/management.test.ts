import { Context } from "react";

import { ContextManager } from "../src/management";
import { IDENTIFIER_KEY } from "../src/internals";
import { CONTEXT_MANAGERS_REGISTRY, CONTEXT_OBSERVERS_REGISTRY, CONTEXT_STATES_REGISTRY } from "../src/registry";

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
    expect(TestContextManager["IS_SINGLE"]).toBeFalsy();

    expect(typeof testContextManager.setContext).toBe("function");
    expect(typeof testContextManager.forceUpdate).toBe("function");
    expect(typeof testContextManager["beforeUpdate"]).toBe("function");
    expect(typeof testContextManager["afterUpdate"]).toBe("function");
    expect(typeof testContextManager["onProvisionStarted"]).toBe("function");
    expect(typeof testContextManager["onProvisionEnded"]).toBe("function");

    expect(typeof TestContextManager.REACT_CONTEXT).toBe("object");
    expect(typeof TestContextManager.REACT_CONTEXT.Provider).toBe("object");
    expect(typeof TestContextManager.REACT_CONTEXT.Consumer).toBe("object");

    expect(Object.keys(TestContextManager)).toHaveLength(0);
    expect(Object.keys(TestContextManager.prototype)).toHaveLength(1);
    expect(Object.keys(testContextManager)).toHaveLength(1);

    // Base class has all methods included.
    expect(Object.keys(ContextManager.prototype)).toHaveLength(7);
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
});
