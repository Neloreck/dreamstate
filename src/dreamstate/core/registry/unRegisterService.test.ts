import {
  CONTEXT_OBSERVERS_REGISTRY,
  CONTEXT_SIGNAL_HANDLERS_REGISTRY,
  CONTEXT_STATES_REGISTRY,
  CONTEXT_SUBSCRIBERS_REGISTRY,
  CONTEXT_SERVICES_ACTIVATED,
  CONTEXT_SERVICES_REGISTRY
} from "@/dreamstate/core/internals";
import { unRegisterService } from "@/dreamstate/core/registry//unRegisterService";
import { registerService } from "@/dreamstate/core/registry/registerService";
import { getCurrent } from "@/dreamstate/test-utils/registry/getCurrent";
import { TestContextManager, ExtendingTestContextManager } from "@/fixtures";

describe("unRegisterService method functionality", () => {
  it("Should properly unregister context managers", () => {
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

  it("Should properly restrict signaling and data queries after unregistering", () => {
    registerService(ExtendingTestContextManager);

    const service: ExtendingTestContextManager = getCurrent(ExtendingTestContextManager)!;

    expect(() => service["emitSignal"]({ type: "TMP" })).not.toThrow(Error);
    expect(() => service["queryDataSync"]({ type: "TMP" })).not.toThrow(Error);
    expect(() => service["queryDataAsync"]({ type: "TMP" })).not.toThrow(Error);

    unRegisterService(ExtendingTestContextManager);

    expect(() => service["emitSignal"]({ type: "TMP" })).toThrow(Error);
    expect(() => service["queryDataSync"]({ type: "TMP" })).toThrow(Error);
    expect(() => service["queryDataAsync"]({ type: "TMP" })).toThrow(Error);
  });
});
