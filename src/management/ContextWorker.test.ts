import { CONTEXT_WORKERS_REGISTRY } from "../internals";
import {
  addWorkerObserverToRegistry,
  removeWorkerObserverFromRegistry
} from "../registry";
import { registerWorker, unRegisterWorker } from "../test-utils";

import { TestSingleContextWorker, TestContextWorker } from "@Tests/assets";

describe("ContextWorker class.", () => {
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
});
