import { CONTEXT_REACT_CONTEXTS_REGISTRY, CONTEXT_WORKERS_REGISTRY } from "../internals";
import { addWorkerObserverToRegistry, removeWorkerObserverFromRegistry } from "../registry";
import { nextAsyncQueue, registerWorker, unRegisterWorker } from "../test-utils";
import { ContextManager, ContextWorker } from "./index";
import { ISignalEvent, TAnyContextManagerConstructor, TDreamstateWorker } from "../types";
import { subscribeToSignals, unsubscribeFromSignals } from "../signals";

import {
  TestSingleContextWorker,
  TestContextWorker,
  TestContextManager,
  TestSingleContextManager, EmittingContextManager
} from "@Tests/assets";

describe("ContextWorker class.", () => {
  it("Should initialize worker classes without any exceptions.", () => {
    const testContextManagerInit = (WorkerConstructor: TDreamstateWorker, isSingle: boolean = false) => {
      const worker = new WorkerConstructor();

      expect(worker).toBeInstanceOf(ContextWorker);
      expect(worker).toBeInstanceOf(WorkerConstructor);

      // @ts-ignore Test to detect API changes of ContextManager class.
      expect(WorkerConstructor["IS_SINGLE"]).toBe(isSingle);

      expect(typeof worker["onProvisionStarted"]).toBe("function");
      expect(typeof worker["onProvisionEnded"]).toBe("function");
      expect(typeof worker["emitSignal"]).toBe("function");
      expect(typeof worker["queryData"]).toBe("function");

      expect(Object.keys(WorkerConstructor)).toHaveLength(isSingle ? 1 : 0);
      expect(Object.keys(WorkerConstructor.prototype)).toHaveLength(0);

      if (WorkerConstructor instanceof ContextManager) {
        const ManagerConstructor: TAnyContextManagerConstructor = WorkerConstructor as any;
        const manager: ContextManager<any> = worker as ContextManager<any>;

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
        CONTEXT_REACT_CONTEXTS_REGISTRY.delete(WorkerConstructor);
      }
    };

    expect(Object.keys(ContextManager.prototype)).toHaveLength(0);

    testContextManagerInit(TestContextManager);
    testContextManagerInit(TestContextWorker);
    testContextManagerInit(TestSingleContextManager, true);
    testContextManagerInit(TestSingleContextWorker, true);
  });

  it("Should properly handle onProvisionStarted and onProvision ended for context workers.", () => {
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextWorker)).toBeUndefined();

    const testWorker: TestContextWorker = registerWorker(TestContextWorker);
    const testSingleWorker: TestContextWorker = registerWorker(TestSingleContextWorker);

    const firstObserver: jest.Mock = jest.fn();
    const secondObserver: jest.Mock = jest.fn();

    testWorker["onProvisionStarted"] = jest.fn();
    testWorker["onProvisionEnded"] = jest.fn();

    testSingleWorker["onProvisionStarted"] = jest.fn();
    testSingleWorker["onProvisionEnded"] = jest.fn();

    const clearMocks = () => {
      firstObserver.mockClear();
      secondObserver.mockClear();
      (testWorker["onProvisionStarted"] as jest.Mocked<any>).mockClear();
      (testWorker["onProvisionEnded"] as jest.Mocked<any>).mockClear();
      (testSingleWorker["onProvisionStarted"] as jest.Mocked<any>).mockClear();
      (testSingleWorker["onProvisionEnded"] as jest.Mocked<any>).mockClear();
    };

    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextWorker)).toBeDefined();

    addWorkerObserverToRegistry(TestContextWorker, firstObserver);

    expect(testWorker["onProvisionStarted"]).toHaveBeenCalled();
    expect(testWorker["onProvisionEnded"]).not.toHaveBeenCalled();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextWorker)).toBeDefined();
    clearMocks();

    addWorkerObserverToRegistry(TestContextWorker, secondObserver);
    expect(testWorker["onProvisionStarted"]).not.toHaveBeenCalled();
    expect(testWorker["onProvisionEnded"]).not.toHaveBeenCalled();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextWorker)).toBeDefined();
    clearMocks();

    removeWorkerObserverFromRegistry(TestContextWorker, secondObserver);

    expect(testWorker["onProvisionStarted"]).not.toHaveBeenCalled();
    expect(testWorker["onProvisionEnded"]).not.toHaveBeenCalled();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextWorker)).toBeDefined();
    clearMocks();

    removeWorkerObserverFromRegistry(TestContextWorker, firstObserver);

    expect(testWorker["onProvisionStarted"]).not.toHaveBeenCalled();
    expect(testWorker["onProvisionEnded"]).toHaveBeenCalled();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextWorker)).toBeUndefined();
    clearMocks();

    /**
     * Singleton workers should not destroy after provision end.
     * Singleton workers should be created after first use only.
     */

    addWorkerObserverToRegistry(TestSingleContextWorker, firstObserver);

    expect(testSingleWorker["onProvisionStarted"]).toHaveBeenCalled();
    expect(testSingleWorker["onProvisionEnded"]).not.toHaveBeenCalled();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestSingleContextWorker)).toBeDefined();
    clearMocks();

    removeWorkerObserverFromRegistry(TestSingleContextWorker, firstObserver);

    expect(testSingleWorker["onProvisionStarted"]).not.toHaveBeenCalled();
    expect(testSingleWorker["onProvisionEnded"]).toHaveBeenCalled();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestSingleContextWorker)).toBeDefined();
    clearMocks();

    unRegisterWorker(TestContextWorker);
    unRegisterWorker(TestSingleContextWorker);
  });

  it("Should correctly save singleton workers state after provision restart and force unregister.", () => {
    const first: TestSingleContextWorker = registerWorker(TestSingleContextWorker);

    const createdAt: number = first.createdAt;

    unRegisterWorker(TestSingleContextWorker, false);

    const second = registerWorker(TestSingleContextWorker);

    expect(second).toBe(first);
    expect(second.createdAt).toBe(createdAt);

    unRegisterWorker(TestSingleContextWorker);

    const third: TestSingleContextWorker = registerWorker(TestSingleContextWorker);

    expect(second).not.toBe(third);
    expect(second.createdAt).not.toBe(third.createdAt);

    unRegisterWorker(TestSingleContextWorker);
  });

  it("Should use emitSignal method when sending signals.", async () => {
    const emittingContextManager: EmittingContextManager = registerWorker(EmittingContextManager);
    const spy = jest.fn((signal: ISignalEvent) => {
      expect(signal.emitter).toBe(EmittingContextManager);
      expect(signal.type).toBe("TEST");
    });

    subscribeToSignals(spy);

    emittingContextManager["emitSignal"]({ type: "TEST" });

    await nextAsyncQueue();

    expect(spy).toHaveBeenCalled();

    unsubscribeFromSignals(spy);
    unRegisterWorker(EmittingContextManager);
  });
});
