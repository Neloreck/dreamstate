import { CONTEXT_OBSERVERS_REGISTRY, CONTEXT_SERVICES_REGISTRY } from "@/dreamstate/core/internals";
import { addServiceObserverToRegistry } from "@/dreamstate/core/registry/addServiceObserverToRegistry";
import { TestContextManager } from "@/fixtures";

describe("addServiceObserverToRegistry method functionality", () => {
  it("Should properly add manager observer to set", () => {
    expect(CONTEXT_OBSERVERS_REGISTRY.has(TestContextManager)).toBeFalsy();

    const observer = jest.fn();
    const spy = jest.fn();
    const testContextService: TestContextManager = new TestContextManager();

    testContextService["onProvisionStarted"] = spy;

    CONTEXT_OBSERVERS_REGISTRY.set(TestContextManager, new Set());
    CONTEXT_SERVICES_REGISTRY.set(TestContextManager, testContextService);

    addServiceObserverToRegistry(TestContextManager, observer);

    expect(spy).toHaveBeenCalled();
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.has(observer)).toBeTruthy();

    CONTEXT_OBSERVERS_REGISTRY.delete(TestContextManager);
    CONTEXT_SERVICES_REGISTRY.delete(TestContextManager);
  });
});
