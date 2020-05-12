import {
  addServiceObserver,
  registerService,
  removeServiceObserver,
  unRegisterService
} from "../test-utils";
import { CONTEXT_OBSERVERS_REGISTRY } from "../internals";

import { ExampleContextManager, TestContextManager, TestContextService } from "@Tests/assets";

describe("Remove manager observer util.", () => {
  beforeAll(() => {
    registerService(TestContextManager);
  });

  afterAll(() => {
    unRegisterService(TestContextManager);
  });

  it("Should throw errors for wrong method targets.", () => {
    expect(() => removeServiceObserver(null as any, jest.fn())).toThrow(TypeError);
    expect(() => removeServiceObserver(undefined as any, jest.fn())).toThrow(TypeError);
    expect(() => removeServiceObserver(0 as any, jest.fn())).toThrow(TypeError);
    expect(() => removeServiceObserver(class Any {} as any, jest.fn())).toThrow(TypeError);
    expect(() => removeServiceObserver(TestContextService as any, jest.fn())).toThrow(Error);
    expect(() => removeServiceObserver(ExampleContextManager, jest.fn())).toThrow(Error);
  });

  it("Should remove observer from registry.", () => {
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

  it("Should properly trigger lifecycle of manager.", async () => {
    const manager: TestContextManager = registerService(TestContextManager);
    const spy = jest.fn();
    const observer = jest.fn();

    manager["onProvisionEnded"] = spy;

    addServiceObserver(TestContextManager, observer);

    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(1);
    expect(spy).not.toHaveBeenCalled();

    removeServiceObserver(TestContextManager, observer);

    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)!.size).toBe(0);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
