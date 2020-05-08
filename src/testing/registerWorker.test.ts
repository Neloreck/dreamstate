import {
  CONTEXT_OBSERVERS_REGISTRY,
  CONTEXT_QUERY_METADATA_REGISTRY,
  CONTEXT_REACT_CONTEXTS_REGISTRY,
  CONTEXT_SIGNAL_HANDLERS_REGISTRY,
  CONTEXT_SIGNAL_METADATA_REGISTRY,
  CONTEXT_STATES_REGISTRY,
  CONTEXT_SUBSCRIBERS_REGISTRY,
  CONTEXT_WORKERS_ACTIVATED,
  CONTEXT_WORKERS_REGISTRY
} from "../internals";
import { registerWorker, unRegisterWorker } from "../test-utils";

import { ExampleContextManager, TestContextManager, TestContextWorker } from "@Tests/assets";

describe("Register worker test util.", () => {
  it("Should not be initialized before test.", () => {
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_QUERY_METADATA_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_REACT_CONTEXTS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_SIGNAL_METADATA_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_WORKERS_ACTIVATED.size).toBe(0);
  });

  it("Should throw errors for wrong method targets.", () => {
    expect(() => registerWorker(class Any {} as any)).toThrow(TypeError);
    expect(() => registerWorker(1 as any)).toThrow(TypeError);
    expect(() => registerWorker(undefined as any)).toThrow(TypeError);
    expect(() => registerWorker(null as any)).toThrow(TypeError);
  });

  it("Should properly register workers like library does.", () => {
    const testContextManager = registerWorker(TestContextManager);

    expect(testContextManager).toBeDefined();
    expect(testContextManager).toBeInstanceOf(TestContextManager);

    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextManager)).toBe(testContextManager);
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeInstanceOf(Set);
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(0);
    expect(CONTEXT_QUERY_METADATA_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_REACT_CONTEXTS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_SIGNAL_METADATA_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestContextManager)).toBeInstanceOf(Object);
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)).toBeInstanceOf(Set);
    expect(CONTEXT_WORKERS_ACTIVATED.size).toBe(1);

    unRegisterWorker(TestContextManager);
  });

  it("Should not re-initialize existing workers.", () => {
    const testContextManager: TestContextManager = registerWorker(TestContextManager);
    const nextContextManager: TestContextManager = registerWorker(TestContextManager);

    expect(testContextManager).toBe(nextContextManager);

    unRegisterWorker(TestContextManager);
  });
});
