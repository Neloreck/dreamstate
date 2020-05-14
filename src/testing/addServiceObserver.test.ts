import { addServiceObserver } from "@Lib/testing/addServiceObserver";
import { registerService } from "@Lib/testing/registerService";
import { removeServiceObserver } from "@Lib/testing/removeServiceObserver";
import { unRegisterService } from "@Lib/testing/unRegisterService";
import { CONTEXT_OBSERVERS_REGISTRY } from "@Lib/internals";
import { ExampleContextManager, TestContextManager, TestContextService } from "@Lib/fixtures";

describe("Add manager observer util.", () => {
  beforeAll(() => {
    registerService(TestContextManager);
  });

  afterAll(() => {
    unRegisterService(TestContextManager);
  });

  it("Should throw errors for wrong method targets.", () => {
    expect(() => addServiceObserver(null as any, jest.fn())).toThrow(TypeError);
    expect(() => addServiceObserver(undefined as any, jest.fn())).toThrow(TypeError);
    expect(() => addServiceObserver(0 as any, jest.fn())).toThrow(TypeError);
    expect(() => addServiceObserver(class Any {} as any, jest.fn())).toThrow(TypeError);
    expect(() => addServiceObserver(TestContextService as any, jest.fn())).toThrow(Error);
    expect(() => addServiceObserver(ExampleContextManager, jest.fn())).toThrow(Error);
  });

  it("Should add observer to registry.", () => {
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeInstanceOf(Set);
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(0);

    const observer = jest.fn();

    addServiceObserver(TestContextManager, observer);

    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeInstanceOf(Set);
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(1);

    removeServiceObserver(TestContextManager, observer);
  });

  it("Should properly trigger lifecycle of manager.", async () => {
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
