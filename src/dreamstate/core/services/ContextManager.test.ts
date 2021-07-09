import {
  CONTEXT_REACT_CONTEXTS_REGISTRY,
  SCOPE_SYMBOL,
  SIGNALING_HANDLER_SYMBOL
} from "@/dreamstate/core/internals";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { getReactContext } from "@/dreamstate/core/services/getReactContext";
import { getCurrent } from "@/dreamstate/test-utils/registry/getCurrent";
import { mockManagerWithScope } from "@/dreamstate/test-utils/registry/mockManagerWithScope";
import { mockScope } from "@/dreamstate/test-utils/registry/mockScope";
import { ISignalEvent, TAnyContextManagerConstructor } from "@/dreamstate/types";
import {
  EmittingManager,
  ExtendingManager,
  TestManager
} from "@/fixtures";

describe("ContextManager class", () => {
  it("Should properly handle setContext and forceUpdate method update with prev/next props", () => {
    const [ manager ] = mockManagerWithScope(TestManager);

    expect(manager.context.first).toBe("first");
    expect(manager.context.second).toBe(2);

    manager.setContext(() => ({ first: "updated", second: 22 }));

    expect(manager.context.first).toBe("updated");
    expect(manager.context.second).toBe(22);

    /**
     * Should force updates correctly.
     */
    const oldContext = manager.context;

    manager.forceUpdate();

    expect(oldContext).not.toBe(manager.context);
  });

  it("Should properly manage extended managers", () => {
    const scope: IScopeContext = mockScope();

    scope.INTERNAL.registerService(TestManager);
    scope.INTERNAL.registerService(ExtendingManager);

    expect(getCurrent(TestManager, scope)).not.toBeNull();
    expect(getCurrent(ExtendingManager, scope)).not.toBeNull();
    expect(getCurrent(TestManager, scope)).not.toBe(getCurrent(ExtendingManager, scope));

    expect(scope.INTERNAL.REGISTRY.CONTEXT_INSTANCES_REGISTRY.has(TestManager)).toBeTruthy();
    expect(scope.INTERNAL.REGISTRY.CONTEXT_INSTANCES_REGISTRY.has(ExtendingManager)).toBeTruthy();

    scope.INTERNAL.unRegisterService(TestManager);
    scope.INTERNAL.unRegisterService(ExtendingManager);

    expect(getCurrent(TestManager, scope)).toBeNull();
    expect(getCurrent(ExtendingManager, scope)).toBeNull();
  });

  it("Should use getReactContext for REACT_CONTEXT and return same result", () => {
    expect(getReactContext(TestManager)).toBe(TestManager.REACT_CONTEXT);
    CONTEXT_REACT_CONTEXTS_REGISTRY.delete(TestManager);
  });

  it("Should initialize service classes without any exceptions", () => {
    const testContextManagerInit = (ManagerClass: TAnyContextManagerConstructor) => {
      const service = new ManagerClass();

      expect(service).toBeInstanceOf(ContextManager);
      expect(service).toBeInstanceOf(ManagerClass);

      expect(typeof service["onProvisionStarted"]).toBe("function");
      expect(typeof service["onProvisionEnded"]).toBe("function");
      expect(typeof service["emitSignal"]).toBe("function");
      expect(typeof service["queryDataAsync"]).toBe("function");
      expect(typeof service["queryDataSync"]).toBe("function");

      expect(Object.keys(ManagerClass.prototype)).toHaveLength(0);

      expect(service[SCOPE_SYMBOL]).toBeUndefined();
      expect(service[SIGNALING_HANDLER_SYMBOL]).toBeUndefined();

      expect(Object.keys(service)).toHaveLength(1);
      expect(service).toBeInstanceOf(ContextManager);
      expect(service.context).toBeInstanceOf(Object);

      expect(typeof service.setContext).toBe("function");
      expect(typeof service.forceUpdate).toBe("function");

      expect(typeof ManagerClass.REACT_CONTEXT).toBe("object");
      expect(typeof ManagerClass.REACT_CONTEXT.Provider).toBe("object");
      expect(typeof ManagerClass.REACT_CONTEXT.Consumer).toBe("object");

      // Cleanup persistent REACT_CONTEXT ref.
      CONTEXT_REACT_CONTEXTS_REGISTRY.delete(ManagerClass);
    };

    expect(Object.keys(ContextManager.prototype)).toHaveLength(0);

    testContextManagerInit(TestManager);
    testContextManagerInit(EmittingManager);
  });

  it("Should use emitSignal method when sending signals", async () => {
    const [ emittingContextManager, scope ] = mockManagerWithScope(EmittingManager);
    const spy = jest.fn((signal: ISignalEvent) => {
      expect(signal.emitter).toBe(EmittingManager);
      expect(signal.type).toBe("TEST");
    });

    scope.subscribeToSignals(spy);

    emittingContextManager["emitSignal"]({ type: "TEST" });

    expect(spy).toHaveBeenCalled();
  });
});
