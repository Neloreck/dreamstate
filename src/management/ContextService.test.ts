import { CONTEXT_REACT_CONTEXTS_REGISTRY } from "@Lib/internals";
import { nextAsyncQueue } from "@Lib/testing/nextAsyncQueue";
import { registerService } from "@Lib/testing/registerService";
import { unRegisterService } from "@Lib/testing/unRegisterService";
import { ContextService } from "@Lib/management/ContextService";
import { ContextManager } from "@Lib/management/ContextManager";
import { ISignalEvent, TAnyContextManagerConstructor, TDreamstateService } from "@Lib/types";
import { subscribeToSignals } from "@Lib/signals/subscribeToSignals";
import { unsubscribeFromSignals } from "@Lib/signals/unsubscribeFromSignals";
import {
  TestSingleContextService,
  TestContextService,
  TestContextManager,
  TestSingleContextManager,
  EmittingContextManager
} from "@Lib/fixtures";

describe("ContextService class.", () => {
  it("Should initialize service classes without any exceptions.", () => {
    const testContextManagerInit = (Service: TDreamstateService, isSingle: boolean = false) => {
      const service = new Service();

      expect(service).toBeInstanceOf(ContextService);
      expect(service).toBeInstanceOf(Service);

      // @ts-ignore Test to detect API changes of ContextManager class.
      expect(Service["IS_SINGLE"]).toBe(isSingle);

      expect(typeof service["onProvisionStarted"]).toBe("function");
      expect(typeof service["onProvisionEnded"]).toBe("function");
      expect(typeof service["emitSignal"]).toBe("function");
      expect(typeof service["queryData"]).toBe("function");

      expect(Object.keys(Service)).toHaveLength(isSingle ? 1 : 0);
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
    testContextManagerInit(TestSingleContextManager, true);
    testContextManagerInit(TestSingleContextService, true);
  });

  it("Should properly handle onProvisionStarted and onProvision ended for context services.", () => {
    // todo;
  });

  it("Should correctly save singleton services state after provision restart and force unregister.", () => {
    const first: TestSingleContextService = registerService(TestSingleContextService);

    const createdAt: number = first.createdAt;

    unRegisterService(TestSingleContextService, false);

    const second = registerService(TestSingleContextService);

    expect(second).toBe(first);
    expect(second.createdAt).toBe(createdAt);

    unRegisterService(TestSingleContextService);

    const third: TestSingleContextService = registerService(TestSingleContextService);

    expect(second).not.toBe(third);
    expect(second.createdAt).not.toBe(third.createdAt);

    unRegisterService(TestSingleContextService);
  });

  it("Should use emitSignal method when sending signals.", async () => {
    const emittingContextManager: EmittingContextManager = registerService(EmittingContextManager);
    const spy = jest.fn((signal: ISignalEvent) => {
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
