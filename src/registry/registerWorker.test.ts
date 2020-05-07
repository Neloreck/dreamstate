import { registerWorker } from "./registerWorker";
import { unRegisterWorker } from "./unRegisterWorker";
import {
  CONTEXT_OBSERVERS_REGISTRY,
  CONTEXT_SIGNAL_HANDLERS_REGISTRY,
  CONTEXT_STATES_REGISTRY,
  CONTEXT_SUBSCRIBERS_REGISTRY,
  CONTEXT_WORKERS_ACTIVATED,
  CONTEXT_WORKERS_REGISTRY
} from "../internals";

import { TestContextManager, TestContextWorker } from "@Tests/assets";

describe("registerWorker method functionality.", () => {
  it("Should properly register generic worker.", () => {
    expect(CONTEXT_WORKERS_REGISTRY.has(TestContextWorker)).toBeFalsy();
    expect(CONTEXT_WORKERS_ACTIVATED.size).toBe(0);
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextWorker)).toBeUndefined();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextWorker)).toBeUndefined();
    expect(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(TestContextWorker)).toBeUndefined();
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextWorker)).toBeUndefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestContextWorker)).toBeUndefined();

    registerWorker(TestContextWorker);

    expect(CONTEXT_WORKERS_REGISTRY.has(TestContextWorker)).toBeTruthy();
    expect(CONTEXT_WORKERS_ACTIVATED.size).toBe(1);
    expect(CONTEXT_WORKERS_ACTIVATED.has(TestContextWorker)).toBeTruthy();
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextWorker)).toBeDefined();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextWorker)).toBeDefined();
    expect(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(TestContextWorker)).toBeDefined();
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextWorker)).toBeUndefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestContextWorker)).toBeUndefined();

    unRegisterWorker(TestContextWorker);
  });

  it("Should properly register context managers.", () => {
    expect(CONTEXT_WORKERS_REGISTRY.has(TestContextManager)).toBeFalsy();
    expect(CONTEXT_WORKERS_ACTIVATED.size).toBe(0);
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestContextManager)).toBeUndefined();

    registerWorker(TestContextManager);

    expect(CONTEXT_WORKERS_REGISTRY.has(TestContextManager)).toBeTruthy();
    expect(CONTEXT_WORKERS_ACTIVATED.size).toBe(1);
    expect(CONTEXT_WORKERS_ACTIVATED.has(TestContextManager)).toBeTruthy();
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestContextManager)).toBeDefined();

    unRegisterWorker(TestContextWorker);
  });
});
