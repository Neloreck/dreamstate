import { CONTEXT_OBSERVERS_REGISTRY } from "@/dreamstate/core/internals";
import { addServiceObserver } from "@/dreamstate/test-utils/registry/addServiceObserver";
import { registerService } from "@/dreamstate/test-utils/registry/registerService";
import { removeServiceObserver } from "@/dreamstate/test-utils/registry/removeServiceObserver";
import { unRegisterService } from "@/dreamstate/test-utils/registry/unRegisterService";
import { TestContextManager, TestContextService } from "@/fixtures";

describe("Add manager observer util", () => {
  beforeAll(() => {
    registerService(TestContextManager);
  });

  afterAll(() => {
    unRegisterService(TestContextManager);
  });

  it("Should throw errors for wrong method targets", () => {
    expect(() => addServiceObserver(null as any, jest.fn())).toThrow(TypeError);
    expect(() => addServiceObserver(undefined as any, jest.fn())).toThrow(TypeError);
    expect(() => addServiceObserver(0 as any, jest.fn())).toThrow(TypeError);
    expect(() => addServiceObserver(class Any {} as any, jest.fn())).toThrow(TypeError);
    expect(() => addServiceObserver(TestContextService as any, jest.fn())).toThrow(Error);
    expect(() => addServiceObserver(class Ext extends TestContextManager {}, jest.fn())).toThrow(Error);
  });

  it("Should add observer to registry", () => {
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeInstanceOf(Set);
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(0);

    const observer = jest.fn();

    addServiceObserver(TestContextManager, observer);

    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeInstanceOf(Set);
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(1);

    removeServiceObserver(TestContextManager, observer);
  });

  it("Should properly trigger lifecycle of manager", async () => {
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(0);

    const manager: TestContextManager = registerService(TestContextManager);
    const spy = jest.fn();
    const observer = jest.fn();

    manager["onProvisionStarted"] = spy;

    addServiceObserver(TestContextManager, observer);

    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockClear();
  });
});
