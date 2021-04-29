import { CONTEXT_OBSERVERS_REGISTRY } from "@/dreamstate/core/internals";
import { addServiceObserver } from "@/dreamstate/test-utils/registry/addServiceObserver";
import { registerService } from "@/dreamstate/test-utils/registry/registerService";
import { removeServiceObserver } from "@/dreamstate/test-utils/registry/removeServiceObserver";
import { unRegisterService } from "@/dreamstate/test-utils/registry/unRegisterService";
import { TestContextManager } from "@/fixtures";

describe("Remove manager observer util", () => {
  beforeAll(() => {
    registerService(TestContextManager);
  });

  afterAll(() => {
    unRegisterService(TestContextManager);
  });

  it("Should throw errors for wrong method targets", () => {
    expect(() => removeServiceObserver(null as any, jest.fn())).toThrow(TypeError);
    expect(() => removeServiceObserver(undefined as any, jest.fn())).toThrow(TypeError);
    expect(() => removeServiceObserver(0 as any, jest.fn())).toThrow(TypeError);
    expect(() => removeServiceObserver(class Any {} as any, jest.fn())).toThrow(TypeError);
    expect(() => removeServiceObserver(class Ext extends TestContextManager {}, jest.fn())).toThrow(Error);
  });

  it("Should remove observer from registry", () => {
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeInstanceOf(Set);
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(0);

    const first = jest.fn();
    const second = jest.fn();

    addServiceObserver(TestContextManager, first);
    addServiceObserver(TestContextManager, second);

    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeInstanceOf(Set);
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(2);

    removeServiceObserver(TestContextManager, first);

    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(1);

    removeServiceObserver(TestContextManager, second);

    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(0);
  });

  it("Should not trigger lifecycle of manager", async () => {
    const manager: TestContextManager = registerService(TestContextManager);
    const spy = jest.fn();
    const observer = jest.fn();

    manager["onProvisionEnded"] = spy;

    addServiceObserver(TestContextManager, observer);

    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(1);
    expect(spy).not.toHaveBeenCalled();

    removeServiceObserver(TestContextManager, observer);

    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(0);
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
