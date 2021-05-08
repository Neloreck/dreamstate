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
import { nextAsyncQueue } from "@/dreamstate/test-utils/utils/nextAsyncQueue";
import {
  TAnyContextManagerConstructor,
  TDerivedSignalEvent
} from "@/dreamstate/types";
import {
  EmittingContextManager,
  ExtendingTestContextManager,
  ITestContext,
  TestContextManager
} from "@/fixtures";

describe("ContextManager class", () => {
  it("Should properly handle setContext and forceUpdate method update with prev/next props", () => {
    const [ manager ] = mockManagerWithScope(TestContextManager);

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
  });

  it("Should properly manage extended managers", () => {
    const scope: IScopeContext = mockScope();

    scope.registerService(TestContextManager);
    scope.registerService(ExtendingTestContextManager);

    expect(getCurrent(TestContextManager, scope)).not.toBeNull();
    expect(getCurrent(ExtendingTestContextManager, scope)).not.toBeNull();
    expect(getCurrent(TestContextManager, scope)).not.toBe(getCurrent(ExtendingTestContextManager, scope));

    expect(scope.REGISTRY.CONTEXT_INSTANCES_REGISTRY.has(TestContextManager)).toBeTruthy();
    expect(scope.REGISTRY.CONTEXT_INSTANCES_REGISTRY.has(ExtendingTestContextManager)).toBeTruthy();

    scope.unRegisterService(TestContextManager);
    scope.unRegisterService(ExtendingTestContextManager);

    expect(getCurrent(TestContextManager, scope)).toBeNull();
    expect(getCurrent(ExtendingTestContextManager, scope)).toBeNull();
  });

  it("Should use getReactContext for REACT_CONTEXT and return same result", () => {
    expect(getReactContext(TestContextManager)).toBe(TestContextManager.REACT_CONTEXT);
    CONTEXT_REACT_CONTEXTS_REGISTRY.delete(TestContextManager);
  });

  it("Should initialize service classes without any exceptions", () => {
    const testContextManagerInit = (Service: TAnyContextManagerConstructor) => {
      const service = new Service();

      expect(service).toBeInstanceOf(ContextManager);
      expect(service).toBeInstanceOf(Service);

      expect(typeof service["onProvisionStarted"]).toBe("function");
      expect(typeof service["onProvisionEnded"]).toBe("function");
      expect(typeof service["emitSignal"]).toBe("function");
      expect(typeof service["queryDataAsync"]).toBe("function");
      expect(typeof service["queryDataSync"]).toBe("function");

      expect(Object.keys(Service.prototype)).toHaveLength(0);

      expect(service[SCOPE_SYMBOL]).toBeUndefined();
      expect(service[SIGNALING_HANDLER_SYMBOL]).toBeUndefined();

      expect(Object.keys(service)).toHaveLength(1);
      expect(service).toBeInstanceOf(ContextManager);
      expect(service.context).toBeInstanceOf(Object);

      expect(typeof service.setContext).toBe("function");
      expect(typeof service.forceUpdate).toBe("function");
      expect(typeof service["beforeUpdate"]).toBe("function");
      expect(typeof service["afterUpdate"]).toBe("function");

      expect(typeof Service.REACT_CONTEXT).toBe("object");
      expect(typeof Service.REACT_CONTEXT.Provider).toBe("object");
      expect(typeof Service.REACT_CONTEXT.Consumer).toBe("object");

      // Cleanup persistent REACT_CONTEXT ref.
      CONTEXT_REACT_CONTEXTS_REGISTRY.delete(Service);
    };

    expect(Object.keys(ContextManager.prototype)).toHaveLength(0);

    testContextManagerInit(TestContextManager);
    testContextManagerInit(EmittingContextManager);
  });

  it("Should use emitSignal method when sending signals", async () => {
    const [ emittingContextManager, scope ] = mockManagerWithScope(EmittingContextManager);
    const spy = jest.fn((signal: TDerivedSignalEvent) => {
      expect(signal.emitter).toBe(EmittingContextManager);
      expect(signal.type).toBe("TEST");
    });

    scope.subscribeToSignals(spy);

    emittingContextManager["emitSignal"]({ type: "TEST" });

    await nextAsyncQueue();

    expect(spy).toHaveBeenCalled();
  });
});
