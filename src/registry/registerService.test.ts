import { registerService } from "./registerService";
import { unRegisterService } from "./unRegisterService";
import {
  CONTEXT_OBSERVERS_REGISTRY,
  CONTEXT_SIGNAL_HANDLERS_REGISTRY,
  CONTEXT_STATES_REGISTRY,
  CONTEXT_SUBSCRIBERS_REGISTRY,
  CONTEXT_SERVICES_ACTIVATED,
  CONTEXT_SERVICES_REGISTRY
} from "../internals";

import { TestContextManager, TestContextService } from "@Tests/../fixtures";

describe("registerService method functionality.", () => {
  it("Should properly register generic service.", () => {
    expect(CONTEXT_SERVICES_REGISTRY.has(TestContextService)).toBeFalsy();
    expect(CONTEXT_SERVICES_ACTIVATED.size).toBe(0);
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextService)).toBeUndefined();
    expect(CONTEXT_SERVICES_REGISTRY.get(TestContextService)).toBeUndefined();
    expect(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(TestContextService)).toBeUndefined();
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextService)).toBeUndefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestContextService)).toBeUndefined();

    registerService(TestContextService);

    expect(CONTEXT_SERVICES_REGISTRY.has(TestContextService)).toBeTruthy();
    expect(CONTEXT_SERVICES_ACTIVATED.size).toBe(1);
    expect(CONTEXT_SERVICES_ACTIVATED.has(TestContextService)).toBeTruthy();
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextService)).toBeDefined();
    expect(CONTEXT_SERVICES_REGISTRY.get(TestContextService)).toBeDefined();
    expect(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(TestContextService)).toBeDefined();
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextService)).toBeUndefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestContextService)).toBeUndefined();

    unRegisterService(TestContextService);
  });

  it("Should properly register context managers.", () => {
    expect(CONTEXT_SERVICES_REGISTRY.has(TestContextManager)).toBeFalsy();
    expect(CONTEXT_SERVICES_ACTIVATED.size).toBe(0);
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_SERVICES_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestContextManager)).toBeUndefined();

    registerService(TestContextManager);

    expect(CONTEXT_SERVICES_REGISTRY.has(TestContextManager)).toBeTruthy();
    expect(CONTEXT_SERVICES_ACTIVATED.size).toBe(1);
    expect(CONTEXT_SERVICES_ACTIVATED.has(TestContextManager)).toBeTruthy();
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_SERVICES_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestContextManager)).toBeDefined();

    unRegisterService(TestContextService);
  });
});
