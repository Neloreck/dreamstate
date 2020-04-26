import { CONTEXT_WORKERS_REGISTRY } from "@Lib/internals";
import { addWorkerObserverToRegistry, removeWorkerObserverFromRegistry } from "@Lib/registry";
import { registerWorkerClass } from "@Lib/test-utils";

import { TestContextInterceptor } from "@Tests/assets";

describe("ContextInterceptor creation and management of signals and queries.", () => {
  it("Should properly handle onProvisionStarted and onProvision ended for context interceptors.", () => {
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextInterceptor)).toBeUndefined();

    const testManager: TestContextInterceptor = registerWorkerClass(TestContextInterceptor);

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

    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextInterceptor)).toBeDefined();

    addWorkerObserverToRegistry(TestContextInterceptor, firstObserver);

    expect(testManager["onProvisionStarted"]).toHaveBeenCalled();
    expect(testManager["onProvisionEnded"]).not.toHaveBeenCalled();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextInterceptor)).toBeDefined();
    clearMocks();

    addWorkerObserverToRegistry(TestContextInterceptor, secondObserver);
    expect(testManager["onProvisionStarted"]).not.toHaveBeenCalled();
    expect(testManager["onProvisionEnded"]).not.toHaveBeenCalled();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextInterceptor)).toBeDefined();
    clearMocks();

    removeWorkerObserverFromRegistry(TestContextInterceptor, secondObserver);

    expect(testManager["onProvisionStarted"]).not.toHaveBeenCalled();
    expect(testManager["onProvisionEnded"]).not.toHaveBeenCalled();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextInterceptor)).toBeDefined();
    clearMocks();

    removeWorkerObserverFromRegistry(TestContextInterceptor, firstObserver);

    expect(testManager["onProvisionStarted"]).not.toHaveBeenCalled();
    expect(testManager["onProvisionEnded"]).toHaveBeenCalled();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextInterceptor)).toBeUndefined();
    clearMocks();
  });
});
