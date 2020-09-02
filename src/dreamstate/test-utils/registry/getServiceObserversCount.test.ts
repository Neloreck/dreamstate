import { CONTEXT_OBSERVERS_REGISTRY } from "@/dreamstate/core/internals";
import { ContextService } from "@/dreamstate/core/services/ContextService";
import { addServiceObserver } from "@/dreamstate/test-utils/registry/addServiceObserver";
import { getServiceObserversCount } from "@/dreamstate/test-utils/registry/getServiceObserversCount";
import { registerService } from "@/dreamstate/test-utils/registry/registerService";
import { removeServiceObserver } from "@/dreamstate/test-utils/registry/removeServiceObserver";
import { unRegisterService } from "@/dreamstate/test-utils/registry/unRegisterService";
import { TestContextManager } from "@/fixtures";

describe("Get service observers count util", () => {
  it("Should properly fail for unregistered services", () => {
    expect(() => getServiceObserversCount(TestContextManager)).toThrow();
  });

  it("Should properly tell the count", () => {
    registerService(TestContextManager);

    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeInstanceOf(Set);
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(0);
    expect(getServiceObserversCount(TestContextManager)).toBe(0);

    const first = jest.fn();
    const second = jest.fn();

    addServiceObserver(TestContextManager, first);

    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(1);
    expect(getServiceObserversCount(TestContextManager)).toBe(1);

    addServiceObserver(TestContextManager, second);

    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(2);
    expect(getServiceObserversCount(TestContextManager)).toBe(2);

    removeServiceObserver(TestContextManager, first);

    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(1);
    expect(getServiceObserversCount(TestContextManager)).toBe(1);

    removeServiceObserver(TestContextManager, second);

    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(0);
    expect(getServiceObserversCount(TestContextManager)).toBe(0);

    unRegisterService(TestContextManager);
  });

  it("Should properly validate class parameter", () => {
    expect(() => getServiceObserversCount(1 as any)).toThrow(Error);
    expect(() => getServiceObserversCount("das" as any)).toThrow(Error);
    expect(() => getServiceObserversCount(null as any)).toThrow(Error);
    expect(() => getServiceObserversCount(true as any)).toThrow(Error);
    expect(() => getServiceObserversCount(class Any {} as any)).toThrow(Error);
    expect(() => getServiceObserversCount(class AnyService extends ContextService {} as any)).toThrow(Error);
  });
});
