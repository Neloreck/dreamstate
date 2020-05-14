import {
  CONTEXT_OBSERVERS_REGISTRY,
  CONTEXT_QUERY_METADATA_REGISTRY,
  CONTEXT_REACT_CONTEXTS_REGISTRY,
  CONTEXT_SIGNAL_HANDLERS_REGISTRY,
  CONTEXT_SIGNAL_METADATA_REGISTRY,
  CONTEXT_STATES_REGISTRY,
  CONTEXT_SUBSCRIBERS_REGISTRY,
  CONTEXT_SERVICES_ACTIVATED,
  CONTEXT_SERVICES_REGISTRY
} from "@Lib/core/internals";
import { TestContextManager } from "@Lib/fixtures";
import { registerService } from "@Lib/test-utils/registry/registerService";
import { unRegisterService } from "@Lib/test-utils/registry/unRegisterService";

describe("Register service test util.", () => {
  it("Should not be initialized before test.", () => {
    expect(CONTEXT_SERVICES_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_QUERY_METADATA_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_REACT_CONTEXTS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_SIGNAL_METADATA_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_SERVICES_ACTIVATED.size).toBe(0);
  });

  it("Should throw errors for wrong method targets.", () => {
    expect(() => registerService(class Any {} as any)).toThrow(TypeError);
    expect(() => registerService(1 as any)).toThrow(TypeError);
    expect(() => registerService(undefined as any)).toThrow(TypeError);
    expect(() => registerService(null as any)).toThrow(TypeError);
  });

  it("Should properly register services like library does.", () => {
    const testContextManager = registerService(TestContextManager);

    expect(testContextManager).toBeDefined();
    expect(testContextManager).toBeInstanceOf(TestContextManager);

    expect(CONTEXT_SERVICES_REGISTRY.get(TestContextManager)).toBe(testContextManager);
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeInstanceOf(Set);
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(0);
    expect(CONTEXT_QUERY_METADATA_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_REACT_CONTEXTS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_SIGNAL_METADATA_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestContextManager)).toBeInstanceOf(Object);
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)).toBeInstanceOf(Set);
    expect(CONTEXT_SERVICES_ACTIVATED.size).toBe(1);

    unRegisterService(TestContextManager);
  });

  it("Should not re-initialize existing services.", () => {
    const testContextManager: TestContextManager = registerService(TestContextManager);
    const nextContextManager: TestContextManager = registerService(TestContextManager);

    expect(testContextManager).toBe(nextContextManager);

    unRegisterService(TestContextManager);
  });
});
