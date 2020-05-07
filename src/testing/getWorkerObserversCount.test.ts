import {
  addManagerObserver,
  getWorkerObserversCount,
  registerWorker,
  removeManagerObserver,
  unRegisterWorker
} from "../test-utils";
import { CONTEXT_OBSERVERS_REGISTRY } from "../internals";

import { TestContextManager } from "@Tests/assets";

describe("Get worker observers count util.", () => {
  it("Should properly fail for unregistered workers.", () => {
    expect(() => getWorkerObserversCount(TestContextManager)).toThrow();
  });

  it("Should properly tell the count.", () => {
    registerWorker(TestContextManager);

    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeInstanceOf(Set);
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(0);
    expect(getWorkerObserversCount(TestContextManager)).toBe(0);

    const first = jest.fn();
    const second = jest.fn();

    addManagerObserver(TestContextManager, first);

    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(1);
    expect(getWorkerObserversCount(TestContextManager)).toBe(1);

    addManagerObserver(TestContextManager, second);

    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(2);
    expect(getWorkerObserversCount(TestContextManager)).toBe(2);

    removeManagerObserver(TestContextManager, first);

    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(1);
    expect(getWorkerObserversCount(TestContextManager)).toBe(1);

    removeManagerObserver(TestContextManager, second);

    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(0);
    expect(getWorkerObserversCount(TestContextManager)).toBe(0);

    unRegisterWorker(TestContextManager);
  });
});
