import { createRegistry, IRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";

describe("createRegistry method", () => {
  it("Should correctly initialize empty registry", () => {
    const registry: IRegistry = createRegistry();

    expect(Object.keys(registry)).toHaveLength(8);

    expect(registry.CONTEXT_STATES_REGISTRY).toBeDefined();
    expect(registry.CONTEXT_STATES_REGISTRY).toBeInstanceOf(Map);
    expect(registry.CONTEXT_STATES_REGISTRY.size).toBe(0);

    expect(registry.CONTEXT_SERVICES_REGISTRY).toBeDefined();
    expect(registry.CONTEXT_SERVICES_REGISTRY).toBeInstanceOf(Map);
    expect(registry.CONTEXT_SERVICES_REGISTRY.size).toBe(0);

    expect(registry.CONTEXT_SERVICES_ACTIVATED).toBeDefined();
    expect(registry.CONTEXT_SERVICES_ACTIVATED).toBeInstanceOf(Set);
    expect(registry.CONTEXT_SERVICES_ACTIVATED.size).toBe(0);

    expect(registry.CONTEXT_SUBSCRIBERS_REGISTRY).toBeDefined();
    expect(registry.CONTEXT_SUBSCRIBERS_REGISTRY).toBeInstanceOf(Map);
    expect(registry.CONTEXT_SUBSCRIBERS_REGISTRY.size).toBe(0);

    expect(registry.CONTEXT_OBSERVERS_REGISTRY).toBeDefined();
    expect(registry.CONTEXT_OBSERVERS_REGISTRY).toBeInstanceOf(Map);
    expect(registry.CONTEXT_OBSERVERS_REGISTRY.size).toBe(0);

    expect(registry.CONTEXT_SERVICES_REFERENCES).toBeDefined();
    expect(registry.CONTEXT_SERVICES_REFERENCES).toBeInstanceOf(Map);
    expect(registry.CONTEXT_SERVICES_REFERENCES.size).toBe(0);
  });
});
