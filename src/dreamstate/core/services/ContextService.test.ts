import { CONTEXT_REACT_CONTEXTS_REGISTRY } from "@/dreamstate/core/internals";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { ContextService } from "@/dreamstate/core/services/ContextService";
import { subscribeToSignals } from "@/dreamstate/core/signals/subscribeToSignals";
import { unsubscribeFromSignals } from "@/dreamstate/core/signals/unsubscribeFromSignals";
import { registerService } from "@/dreamstate/test-utils/registry/registerService";
import { unRegisterService } from "@/dreamstate/test-utils/registry/unRegisterService";
import { nextAsyncQueue } from "@/dreamstate/test-utils/utils/nextAsyncQueue";
import {
  TAnyContextManagerConstructor,
  TAnyContextServiceConstructor,
  TDerivedSignalEvent
} from "@/dreamstate/types";
import {
  TestContextService,
  TestContextManager,
  EmittingContextManager
} from "@/fixtures";

describe("ContextService class", () => {
  it("Should initialize service classes without any exceptions", () => {
    const testContextManagerInit = (Service: TAnyContextServiceConstructor) => {
      const service = new Service();

      expect(service).toBeInstanceOf(ContextService);
      expect(service).toBeInstanceOf(Service);

      expect(typeof service["onProvisionStarted"]).toBe("function");
      expect(typeof service["onProvisionEnded"]).toBe("function");
      expect(typeof service["emitSignal"]).toBe("function");
      expect(typeof service["queryData"]).toBe("function");
      expect(typeof service["queryDataSync"]).toBe("function");

      expect(Object.keys(Service.prototype)).toHaveLength(0);

      if (Service instanceof ContextManager) {
        const ManagerConstructor: TAnyContextManagerConstructor = Service as any;
        const manager: ContextManager<any> = service as ContextManager<any>;

        expect(Object.keys(manager)).toHaveLength(1);
        expect(manager).toBeInstanceOf(ContextManager);
        expect(manager.context).toBeInstanceOf(Object);

        expect(typeof manager.setContext).toBe("function");
        expect(typeof manager.forceUpdate).toBe("function");
        expect(typeof manager["beforeUpdate"]).toBe("function");
        expect(typeof manager["afterUpdate"]).toBe("function");

        expect(typeof ManagerConstructor.REACT_CONTEXT).toBe("object");
        expect(typeof ManagerConstructor.REACT_CONTEXT.Provider).toBe("object");
        expect(typeof ManagerConstructor.REACT_CONTEXT.Consumer).toBe("object");

        // Cleanup persistent REACT_CONTEXT ref.
        CONTEXT_REACT_CONTEXTS_REGISTRY.delete(Service);
      }
    };

    expect(Object.keys(ContextManager.prototype)).toHaveLength(0);

    testContextManagerInit(TestContextManager);
    testContextManagerInit(TestContextService);
  });

  it("Should properly handle onProvisionStarted and onProvision ended for context services", () => {
    // todo;
  });

  it("Should use emitSignal method when sending signals", async () => {
    const emittingContextManager: EmittingContextManager = registerService(EmittingContextManager);
    const spy = jest.fn((signal: TDerivedSignalEvent) => {
      expect(signal.emitter).toBe(EmittingContextManager);
      expect(signal.type).toBe("TEST");
    });

    subscribeToSignals(spy);

    emittingContextManager["emitSignal"]({ type: "TEST" });

    await nextAsyncQueue();

    expect(spy).toHaveBeenCalled();

    unsubscribeFromSignals(spy);
    unRegisterService(EmittingContextManager);
  });
});
