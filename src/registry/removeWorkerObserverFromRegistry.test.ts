import { addWorkerObserverToRegistry } from "./addWorkerObserverToRegistry";
import { removeWorkerObserverFromRegistry } from "./removeWorkerObserverFromRegistry";
import { CONTEXT_OBSERVERS_REGISTRY, CONTEXT_WORKERS_REGISTRY } from "../internals";

import { TestContextWorker } from "@Tests/assets";

describe("removeWorkerObserverFromRegistry method functionality.", () => {
  it("Should properly remove manager observer from set.", () => {
    expect(CONTEXT_OBSERVERS_REGISTRY.has(TestContextWorker)).toBeFalsy();

    const observer = jest.fn();
    const spy = jest.fn();
    const worker: TestContextWorker = new TestContextWorker();

    worker["onProvisionEnded"] = spy;

    CONTEXT_OBSERVERS_REGISTRY.set(TestContextWorker, new Set());
    CONTEXT_WORKERS_REGISTRY.set(TestContextWorker, worker);

    addWorkerObserverToRegistry(TestContextWorker, observer);
    removeWorkerObserverFromRegistry(TestContextWorker, observer);

    expect(spy).toHaveBeenCalled();

    CONTEXT_OBSERVERS_REGISTRY.delete(TestContextWorker);
    CONTEXT_WORKERS_REGISTRY.delete(TestContextWorker);
  });

  it("Should fail if worker was not registered.", () => {
    expect(CONTEXT_OBSERVERS_REGISTRY.has(TestContextWorker)).toBeFalsy();

    CONTEXT_OBSERVERS_REGISTRY.set(TestContextWorker, new Set());

    expect(() => removeWorkerObserverFromRegistry(TestContextWorker, () => {})).toThrow();

    CONTEXT_OBSERVERS_REGISTRY.delete(TestContextWorker);
  });
});
