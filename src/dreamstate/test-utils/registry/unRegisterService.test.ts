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
} from "@/dreamstate/core/internals";
import { registerService } from "@/dreamstate/test-utils/registry/registerService";
import { unRegisterService } from "@/dreamstate/test-utils/registry/unRegisterService";
import { TestContextService } from "@/fixtures";

describe("Unregister service test util", () => {
  it("Should properly unregister services without errors", () => {
    registerService(TestContextService);
    unRegisterService(TestContextService);
  });

  it("Should not work with non-context-services", () => {
    expect(() => unRegisterService(0 as any)).toThrow(TypeError);
    expect(() => unRegisterService(null as any)).toThrow(TypeError);
    expect(() => unRegisterService("asd" as any)).toThrow(TypeError);
    expect(() => unRegisterService(class AnyClass {} as any)).toThrow(TypeError);
  });

  it("Services should be de-initialized after test", () => {
    expect(CONTEXT_SERVICES_REGISTRY.get(TestContextService)).toBeUndefined();
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextService)).toBeInstanceOf(Set);
    expect(CONTEXT_QUERY_METADATA_REGISTRY.get(TestContextService)).toBeUndefined();
    expect(CONTEXT_REACT_CONTEXTS_REGISTRY.get(TestContextService)).toBeUndefined();
    expect(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(TestContextService)).toBeUndefined();
    expect(CONTEXT_SIGNAL_METADATA_REGISTRY.get(TestContextService)).toBeUndefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestContextService)).toBeUndefined();
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextService)).toBeUndefined();
    expect(CONTEXT_SERVICES_ACTIVATED.size).toBe(0);
  });
});
