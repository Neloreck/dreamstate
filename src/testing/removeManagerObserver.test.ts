import {
  addManagerObserver,
  registerWorker,
  removeManagerObserver,
  unRegisterWorker
} from "../test-utils";
import { CONTEXT_OBSERVERS_REGISTRY } from "../internals";

import { TestContextManager } from "@Tests/assets";

describe("Remove manager observer util.", () => {
  beforeAll(() => {
    registerWorker(TestContextManager);
  });

  afterAll(() => {
    unRegisterWorker(TestContextManager);
  });

  it("Should remove observer from registry.", () => {
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeInstanceOf(Set);
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(0);

    const first = jest.fn();
    const second = jest.fn();

    addManagerObserver(TestContextManager, first);
    addManagerObserver(TestContextManager, second);

    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeInstanceOf(Set);
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(2);

    removeManagerObserver(TestContextManager, first);

    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(1);

    removeManagerObserver(TestContextManager, second);

    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(0);
  });

  it("Should properly trigger lifecycle of manager.", async () => {
    const manager: TestContextManager = registerWorker(TestContextManager);
    const spy = jest.fn();
    const observer = jest.fn();

    manager["onProvisionEnded"] = spy;

    addManagerObserver(TestContextManager, observer);

    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(1);
    expect(spy).not.toHaveBeenCalled();

    removeManagerObserver(TestContextManager, observer);

    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(0);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
