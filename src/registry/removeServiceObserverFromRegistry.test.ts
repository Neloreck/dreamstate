import { addServiceObserverToRegistry } from "./addServiceObserverToRegistry";
import { removeServiceObserverFromRegistry } from "./removeServiceObserverFromRegistry";
import { CONTEXT_OBSERVERS_REGISTRY, CONTEXT_SERVICES_REGISTRY } from "../internals";

import { TestContextManager } from "@Tests/assets";

describe("removeServiceObserverFromRegistry method functionality.", () => {
  it("Should properly remove manager observer from set.", () => {
    expect(CONTEXT_OBSERVERS_REGISTRY.has(TestContextManager)).toBeFalsy();

    const observer = jest.fn();
    const spy = jest.fn();
    const service: TestContextManager = new TestContextManager();

    service["onProvisionEnded"] = spy;

    CONTEXT_OBSERVERS_REGISTRY.set(TestContextManager, new Set());
    CONTEXT_SERVICES_REGISTRY.set(TestContextManager, service);

    addServiceObserverToRegistry(TestContextManager, observer);
    removeServiceObserverFromRegistry(TestContextManager, observer);

    expect(spy).toHaveBeenCalled();

    CONTEXT_OBSERVERS_REGISTRY.delete(TestContextManager);
    CONTEXT_SERVICES_REGISTRY.delete(TestContextManager);
  });

  it("Should fail if service was not registered.", () => {
    expect(CONTEXT_OBSERVERS_REGISTRY.has(TestContextManager)).toBeFalsy();

    CONTEXT_OBSERVERS_REGISTRY.set(TestContextManager, new Set());

    expect(() => removeServiceObserverFromRegistry(TestContextManager, () => {})).toThrow();

    CONTEXT_OBSERVERS_REGISTRY.delete(TestContextManager);
  });
});
