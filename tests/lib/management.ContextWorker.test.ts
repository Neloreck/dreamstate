import { CONTEXT_WORKERS_REGISTRY } from "@Lib/internals";
import { addWorkerObserverToRegistry, removeWorkerObserverFromRegistry } from "@Lib/registry";
import { registerWorkerClass } from "@Lib/test-utils";

import { TestContextWorker } from "@Tests/assets";

describe("ContextInterceptor creation and management of signals and queries.", () => {
  it("Should properly handle onProvisionStarted and onProvision ended for context interceptors.", () => {
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextWorker)).toBeUndefined();

    const testManager: TestContextWorker = registerWorkerClass(TestContextWorker);

    const firstObserver: jest.Mock = jest.fn();
    const secondObserver: jest.Mock = jest.fn();

    testManager["onProvisionStarted"] = jest.fn();
    testManager["onProvisionEnded"] = jest.fn();

    const clearMocks = () => {
      firstObserver.mockClear();
      secondObserver.mockClear();
      (testManager["onProvisionStarted"] as jest.Mocked<any>).mockClear();
      (testManager["onProvisionEnded"] as jest.Mocked<any>).mockClear();
    };

    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextWorker)).toBeDefined();

    addWorkerObserverToRegistry(TestContextWorker, firstObserver);

    expect(testManager["onProvisionStarted"]).toHaveBeenCalled();
    expect(testManager["onProvisionEnded"]).not.toHaveBeenCalled();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextWorker)).toBeDefined();
    clearMocks();

    addWorkerObserverToRegistry(TestContextWorker, secondObserver);
    expect(testManager["onProvisionStarted"]).not.toHaveBeenCalled();
    expect(testManager["onProvisionEnded"]).not.toHaveBeenCalled();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextWorker)).toBeDefined();
    clearMocks();

    removeWorkerObserverFromRegistry(TestContextWorker, secondObserver);

    expect(testManager["onProvisionStarted"]).not.toHaveBeenCalled();
    expect(testManager["onProvisionEnded"]).not.toHaveBeenCalled();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextWorker)).toBeDefined();
    clearMocks();

    removeWorkerObserverFromRegistry(TestContextWorker, firstObserver);

    expect(testManager["onProvisionStarted"]).not.toHaveBeenCalled();
    expect(testManager["onProvisionEnded"]).toHaveBeenCalled();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextWorker)).toBeUndefined();
    clearMocks();
  });
});
