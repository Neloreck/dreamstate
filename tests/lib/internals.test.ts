import { Context } from "react";

import {
  CONTEXT_WORKERS_REGISTRY,
  CONTEXT_OBSERVERS_REGISTRY,
  CONTEXT_QUERY_METADATA_REGISTRY,
  CONTEXT_SIGNAL_METADATA_REGISTRY,
  CONTEXT_STATES_REGISTRY,
  CONTEXT_SUBSCRIBERS_REGISTRY,
  SIGNAL_LISTENERS_REGISTRY,
  CONTEXT_WORKERS_ACTIVATED,
  CONTEXT_REACT_CONTEXTS_REGISTRY
} from "@Lib/internals";
import { ContextManager } from "@Lib/management";
import { TAnyContextManagerConstructor } from "@Lib/types";
import { unRegisterWorker } from "@Lib/registry";

import { TestContextManager, TestSingleContextManager } from "@Tests/assets";
import { registerWorkerClass } from "@Tests/helpers";

describe("Context store creation tests.", () => {
  it("Context internals should not exist until first register.", () => {
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_SIGNAL_METADATA_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_QUERY_METADATA_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(SIGNAL_LISTENERS_REGISTRY.size).toBe(0);
    expect(CONTEXT_WORKERS_ACTIVATED.size).toBe(0);
    expect(CONTEXT_REACT_CONTEXTS_REGISTRY.get(TestContextManager)).toBeUndefined();

    registerWorkerClass(TestContextManager);

    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_SIGNAL_METADATA_REGISTRY.get(TestContextManager)).toBeUndefined(); // No signal listeners here.
    expect(CONTEXT_QUERY_METADATA_REGISTRY.get(TestContextManager)).toBeUndefined(); // No query listeners here.
    expect(SIGNAL_LISTENERS_REGISTRY.size).toBe(1);
    expect(CONTEXT_WORKERS_ACTIVATED.size).toBe(1);
    expect(CONTEXT_REACT_CONTEXTS_REGISTRY.get(TestContextManager)).toBeUndefined();

    unRegisterWorker(TestContextManager);

    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_SIGNAL_METADATA_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_QUERY_METADATA_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(SIGNAL_LISTENERS_REGISTRY.size).toBe(0);
    expect(CONTEXT_WORKERS_ACTIVATED.size).toBe(1);
    expect(CONTEXT_REACT_CONTEXTS_REGISTRY.get(TestContextManager)).toBeUndefined();
  });

  it("Related react context should be lazily initialized correctly with changed displayName.", () => {
    expect(CONTEXT_REACT_CONTEXTS_REGISTRY.get(TestContextManager)).toBeUndefined();

    const contextType: Context<object> = TestContextManager.REACT_CONTEXT;

    expect(CONTEXT_REACT_CONTEXTS_REGISTRY.get(TestContextManager)).toBeDefined();

    expect(contextType).not.toBeUndefined();
    expect(contextType.Consumer).not.toBeUndefined();
    expect(contextType.Provider).not.toBeUndefined();
    expect(contextType.displayName).toBe("DS.TestContext");
  });

  it("Should throw errors if trying to unregister not existing instance.", () => {
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(() => unRegisterWorker(TestContextManager)).toThrow();
    expect(() => unRegisterWorker(TestContextManager, true)).toThrow();
  });

  it("Should initialize managers classes without any exceptions.", () => {
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
      expect(typeof manager["emitSignal"]).toBe("function");
      expect(typeof manager["sendQuery"]).toBe("function");

      expect(typeof ManagerConstructor.REACT_CONTEXT).toBe("object");
      expect(typeof ManagerConstructor.REACT_CONTEXT.Provider).toBe("object");
      expect(typeof ManagerConstructor.REACT_CONTEXT.Consumer).toBe("object");

      expect(Object.keys(ManagerConstructor)).toHaveLength(isSingle ? 1 : 0);
      expect(Object.keys(ManagerConstructor.prototype)).toHaveLength(0);
      expect(Object.keys(manager)).toHaveLength(1);

      // Cleanup persistent REACT_CONTEXT ref.
      CONTEXT_REACT_CONTEXTS_REGISTRY.delete(ManagerConstructor);
    };

    expect(Object.keys(ContextManager.prototype)).toHaveLength(0);

    testContextManagerInit(TestContextManager);
    testContextManagerInit(TestSingleContextManager, true);
  });
});
