import { registerService } from "@Lib/registry/registerService";
import { unRegisterService } from "@Lib/registry//unRegisterService";
import { TestContextManager, TestContextService, TestSingleContextService } from "@Lib/fixtures";
import {
  CONTEXT_OBSERVERS_REGISTRY,
  CONTEXT_SIGNAL_HANDLERS_REGISTRY,
  CONTEXT_STATES_REGISTRY,
  CONTEXT_SUBSCRIBERS_REGISTRY,
  CONTEXT_SERVICES_ACTIVATED,
  CONTEXT_SERVICES_REGISTRY
} from "@Lib/internals";

describe("unRegisterService method functionality.", () => {
  it("Should properly unregister generic services.", () => {
    registerService(TestContextService);
    unRegisterService(TestContextService);

    expect(CONTEXT_SERVICES_REGISTRY.has(TestContextService)).toBeFalsy();
    expect(CONTEXT_SERVICES_ACTIVATED.size).toBe(0);
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextService)).toBeDefined();
    expect(CONTEXT_SERVICES_REGISTRY.get(TestContextService)).toBeUndefined();
    expect(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(TestContextService)).toBeUndefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestContextService)).toBeUndefined();
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextService)).toBeUndefined();
  });

  it("Should properly unregister context managers.", () => {
    registerService(TestContextManager);
    unRegisterService(TestContextManager);

    expect(CONTEXT_SERVICES_REGISTRY.has(TestContextManager)).toBeFalsy();
    expect(CONTEXT_SERVICES_ACTIVATED.size).toBe(0);
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_SERVICES_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)).toBeDefined();
  });

  it("Should unregister singletons only with force.", () => {
    registerService(TestSingleContextService);
    unRegisterService(TestSingleContextService);

    expect(CONTEXT_SERVICES_REGISTRY.has(TestSingleContextService)).toBeTruthy();
    expect(CONTEXT_SERVICES_ACTIVATED.size).toBe(1);
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestSingleContextService)).toBeDefined();
    expect(CONTEXT_SERVICES_REGISTRY.get(TestSingleContextService)).toBeDefined();
    expect(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(TestSingleContextService)).toBeDefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestSingleContextService)).toBeUndefined();
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestSingleContextService)).toBeUndefined();

    unRegisterService(TestSingleContextService, true);

    expect(CONTEXT_SERVICES_REGISTRY.has(TestSingleContextService)).toBeFalsy();
    expect(CONTEXT_SERVICES_ACTIVATED.size).toBe(0);
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestSingleContextService)).toBeDefined();
    expect(CONTEXT_SERVICES_REGISTRY.get(TestSingleContextService)).toBeUndefined();
    expect(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(TestSingleContextService)).toBeUndefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestSingleContextService)).toBeUndefined();
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestSingleContextService)).toBeUndefined();
  });
});
