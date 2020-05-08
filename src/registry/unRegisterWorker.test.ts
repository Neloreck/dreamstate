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

import { TestContextManager, TestContextWorker, TestSingleContextWorker } from "@Tests/assets";

describe("register method functionality.", () => {
  it("Should properly unregister generic worker.", () => {
    registerWorker(TestContextWorker);
    unRegisterWorker(TestContextWorker);

    expect(CONTEXT_WORKERS_REGISTRY.has(TestContextWorker)).toBeFalsy();
    expect(CONTEXT_WORKERS_ACTIVATED.size).toBe(0);
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextWorker)).toBeDefined();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextWorker)).toBeUndefined();
    expect(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(TestContextWorker)).toBeUndefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestContextWorker)).toBeUndefined();
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextWorker)).toBeUndefined();
  });

  it("Should properly unregister context managers.", () => {
    registerWorker(TestContextManager);
    unRegisterWorker(TestContextManager);

    expect(CONTEXT_WORKERS_REGISTRY.has(TestContextManager)).toBeFalsy();
    expect(CONTEXT_WORKERS_ACTIVATED.size).toBe(0);
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)).toBeDefined();
  });

  it("Should unregister singletons only with force.", () => {
    registerWorker(TestSingleContextWorker);
    unRegisterWorker(TestSingleContextWorker);

    expect(CONTEXT_WORKERS_REGISTRY.has(TestSingleContextWorker)).toBeTruthy();
    expect(CONTEXT_WORKERS_ACTIVATED.size).toBe(1);
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestSingleContextWorker)).toBeDefined();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestSingleContextWorker)).toBeDefined();
    expect(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(TestSingleContextWorker)).toBeDefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestSingleContextWorker)).toBeUndefined();
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestSingleContextWorker)).toBeUndefined();

    unRegisterWorker(TestSingleContextWorker, true);

    expect(CONTEXT_WORKERS_REGISTRY.has(TestSingleContextWorker)).toBeFalsy();
    expect(CONTEXT_WORKERS_ACTIVATED.size).toBe(0);
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestSingleContextWorker)).toBeDefined();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestSingleContextWorker)).toBeUndefined();
    expect(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(TestSingleContextWorker)).toBeUndefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestSingleContextWorker)).toBeUndefined();
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestSingleContextWorker)).toBeUndefined();
  });
});
