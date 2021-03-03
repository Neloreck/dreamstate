import { CONTEXT_OBSERVERS_REGISTRY, CONTEXT_SERVICES_REGISTRY } from "@/dreamstate/core/internals";
import { addServiceObserverToRegistry } from "@/dreamstate/core/registry/addServiceObserverToRegistry";
import { removeServiceObserverFromRegistry } from "@/dreamstate/core/registry/removeServiceObserverFromRegistry";
import { TestContextManager } from "@/fixtures";

describe("removeServiceObserverFromRegistry method functionality", () => {
  it("Should properly remove manager observer from set", () => {
    expect(CONTEXT_OBSERVERS_REGISTRY.has(TestContextManager)).toBeFalsy();

    const observer = jest.fn();
    const spy = jest.fn();
    const service: TestContextManager = new TestContextManager();

    service["onProvisionEnded"] = spy;

    CONTEXT_OBSERVERS_REGISTRY.set(TestContextManager, new Set());
    CONTEXT_SERVICES_REGISTRY.set(TestContextManager, service);

    addServiceObserverToRegistry(TestContextManager, observer);
    removeServiceObserverFromRegistry(TestContextManager, observer);

    expect(spy).not.toHaveBeenCalled();

    CONTEXT_OBSERVERS_REGISTRY.delete(TestContextManager);
    CONTEXT_SERVICES_REGISTRY.delete(TestContextManager);
  });
});
