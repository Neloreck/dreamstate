import {
  EMPTY_ARR,
  CONTEXT_SERVICES_ACTIVATED,
  CONTEXT_REACT_CONTEXTS_REGISTRY,
  CONTEXT_SERVICES_REGISTRY,
  CONTEXT_STATES_REGISTRY,
  CONTEXT_OBSERVERS_REGISTRY,
  CONTEXT_SUBSCRIBERS_REGISTRY,
  CONTEXT_SIGNAL_HANDLERS_REGISTRY,
  CONTEXT_SIGNAL_METADATA_REGISTRY,
  CONTEXT_QUERY_METADATA_REGISTRY,
  SIGNAL_LISTENERS_REGISTRY, CONTEXT_SERVICES_REFERENCES
} from "@/dreamstate/core/internals/index";
import { unRegisterService } from "@/dreamstate/core/registry/unRegisterService";
import { registerService } from "@/dreamstate/test-utils/registry/registerService";
import { TestContextManager } from "@/fixtures";

describe("Dreamstate internals", () => {
  it("Should contain only listed objects", () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const internals = require("./internals");

    expect(Object.keys(internals)).toHaveLength(12);
  });

  it("Internals should be initialized", () => {
    expect(CONTEXT_SERVICES_ACTIVATED).toBeInstanceOf(Set);
    expect(CONTEXT_SERVICES_ACTIVATED.size).toBe(0);

    expect(EMPTY_ARR).toBeInstanceOf(Array);
    expect(EMPTY_ARR).toHaveLength(0);

    expect(SIGNAL_LISTENERS_REGISTRY).toBeInstanceOf(Set);
    expect(SIGNAL_LISTENERS_REGISTRY.size).toBe(0);

    expect(CONTEXT_SERVICES_REGISTRY).toBeInstanceOf(WeakMap);
    expect(CONTEXT_SERVICES_REFERENCES).toBeInstanceOf(WeakMap);
    expect(CONTEXT_OBSERVERS_REGISTRY).toBeInstanceOf(WeakMap);
    expect(CONTEXT_QUERY_METADATA_REGISTRY).toBeInstanceOf(WeakMap);
    expect(CONTEXT_SIGNAL_HANDLERS_REGISTRY).toBeInstanceOf(WeakMap);
    expect(CONTEXT_SIGNAL_METADATA_REGISTRY).toBeInstanceOf(WeakMap);
    expect(CONTEXT_STATES_REGISTRY).toBeInstanceOf(WeakMap);
    expect(CONTEXT_SUBSCRIBERS_REGISTRY).toBeInstanceOf(WeakMap);
    expect(CONTEXT_REACT_CONTEXTS_REGISTRY).toBeInstanceOf(WeakMap);
  });

  it("Internals should not exist until first register", () => {
    expect(CONTEXT_SERVICES_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_SIGNAL_METADATA_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_QUERY_METADATA_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_SERVICES_REFERENCES.get(TestContextManager)).toBeUndefined();
    expect(SIGNAL_LISTENERS_REGISTRY.size).toBe(0);
    expect(CONTEXT_SERVICES_ACTIVATED.size).toBe(0);
    expect(CONTEXT_REACT_CONTEXTS_REGISTRY.get(TestContextManager)).toBeUndefined();

    registerService(TestContextManager);

    expect(CONTEXT_SERVICES_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_SIGNAL_METADATA_REGISTRY.get(TestContextManager)).toBeUndefined(); // No signal listeners here.
    expect(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_QUERY_METADATA_REGISTRY.get(TestContextManager)).toBeUndefined(); // No query listeners here.
    expect(CONTEXT_SERVICES_REFERENCES.get(TestContextManager)).toBe(0);
    expect(SIGNAL_LISTENERS_REGISTRY.size).toBe(1);
    expect(CONTEXT_SERVICES_ACTIVATED.size).toBe(1);
    expect(CONTEXT_REACT_CONTEXTS_REGISTRY.get(TestContextManager)).toBeUndefined();

    unRegisterService(TestContextManager);

    expect(CONTEXT_SERVICES_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_SIGNAL_METADATA_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_QUERY_METADATA_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_SERVICES_REFERENCES.get(TestContextManager)).toBe(0);
    expect(SIGNAL_LISTENERS_REGISTRY.size).toBe(0);
    expect(CONTEXT_SERVICES_ACTIVATED.size).toBe(0);
    expect(CONTEXT_REACT_CONTEXTS_REGISTRY.get(TestContextManager)).toBeUndefined();
  });
});
