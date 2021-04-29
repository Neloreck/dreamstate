import { CONTEXT_OBSERVERS_REGISTRY, CONTEXT_SERVICES_REGISTRY } from "@/dreamstate/core/internals";
import { addServiceObserverToRegistry } from "@/dreamstate/core/registry/addServiceObserverToRegistry";
import { TestContextManager } from "@/fixtures";

describe("addServiceObserverToRegistry method functionality", () => {
  it("Should properly add manager observer to set and ignore lifecycle", () => {
    expect(CONTEXT_OBSERVERS_REGISTRY.has(TestContextManager)).toBeFalsy();

    const observer = jest.fn();
    const spy = jest.fn();
    const testContextManager: TestContextManager = new TestContextManager();

    testContextManager["onProvisionStarted"] = spy;

    CONTEXT_OBSERVERS_REGISTRY.set(TestContextManager, new Set());
    CONTEXT_SERVICES_REGISTRY.set(TestContextManager, testContextManager);

    addServiceObserverToRegistry(TestContextManager, observer);

    expect(spy).not.toHaveBeenCalled();
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.has(observer)).toBeTruthy();

    CONTEXT_OBSERVERS_REGISTRY.delete(TestContextManager);
    CONTEXT_SERVICES_REGISTRY.delete(TestContextManager);
  });
});
