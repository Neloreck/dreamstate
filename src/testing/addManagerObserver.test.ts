import {
  addManagerObserver,
  registerWorker,
  removeManagerObserver,
  unRegisterWorker
} from "./index";
import { CONTEXT_OBSERVERS_REGISTRY } from "../internals";

import { TestContextManager } from "@Tests/assets";

describe("Add manager observer util.", () => {
  beforeAll(() => {
    registerWorker(TestContextManager);
  });

  afterAll(() => {
    unRegisterWorker(TestContextManager);
  });

  it("Should add observer to registry.", () => {
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeInstanceOf(Set);
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(0);

    const observer = jest.fn();

    addManagerObserver(TestContextManager, observer);

    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeInstanceOf(Set);
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(1);

    removeManagerObserver(TestContextManager, observer);
  });

  it("Should properly trigger lifecycle of manager.", async () => {
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(0);

    const manager: TestContextManager = registerWorker(TestContextManager);
    const spy = jest.fn();
    const observer = jest.fn();

    manager["onProvisionStarted"] = spy;

    addManagerObserver(TestContextManager, observer);

    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockClear();
  });
});
