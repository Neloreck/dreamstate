import { addWorkerObserverToRegistry } from "./addWorkerObserverToRegistry";
import { CONTEXT_OBSERVERS_REGISTRY, CONTEXT_WORKERS_REGISTRY } from "../internals";

import { TestContextWorker } from "@Tests/assets";

describe("addWorkerObserverToRegistry method functionality.", () => {
  it("Should properly add manager observer to set.", () => {
    expect(CONTEXT_OBSERVERS_REGISTRY.has(TestContextWorker)).toBeFalsy();

    const observer = jest.fn();
    const spy = jest.fn();
    const worker: TestContextWorker = new TestContextWorker();

    worker["onProvisionStarted"] = spy;

    CONTEXT_OBSERVERS_REGISTRY.set(TestContextWorker, new Set());
    CONTEXT_WORKERS_REGISTRY.set(TestContextWorker, worker);

    addWorkerObserverToRegistry(TestContextWorker, observer);

    expect(spy).toHaveBeenCalled();
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextWorker)!.has(observer)).toBeTruthy();

    CONTEXT_OBSERVERS_REGISTRY.delete(TestContextWorker);
    CONTEXT_WORKERS_REGISTRY.delete(TestContextWorker);
  });
});
