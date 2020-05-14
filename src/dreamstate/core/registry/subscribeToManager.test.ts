import { CONTEXT_SUBSCRIBERS_REGISTRY } from "@/dreamstate/core/internals";
import { subscribeToManager } from "@/dreamstate/core/registry/subscribeToManager";
import { unsubscribeFromManager } from "@/dreamstate/core/registry/unSubscribeFromManager";
import { registerService } from "@/dreamstate/test-utils/registry/registerService";
import { unRegisterService } from "@/dreamstate/test-utils/registry/unRegisterService";
import { nextAsyncQueue } from "@/dreamstate/test-utils/utils/nextAsyncQueue";
import { ITestContext, TestContextManager, TestContextService } from "@/fixtures";

describe("subscribeToManager method functionality.", () => {
  it("Should not work before registering.", () => {
    expect(() => subscribeToManager(TestContextManager, () => {})).toThrow(Error);
  });

  it("Should not work with non-ContextManager classes.", () => {
    expect(() => subscribeToManager(TestContextService as any, () => {})).toThrow(TypeError);
    expect(() => subscribeToManager(class AnyClass {} as any, () => {})).toThrow(TypeError);
  });

  it("Should properly add subscribers to registry.", () => {
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.has(TestContextManager)).toBeFalsy();

    CONTEXT_SUBSCRIBERS_REGISTRY.set(TestContextManager, new Set());

    const subscriber = jest.fn();

    subscribeToManager(TestContextManager, subscriber);

    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)!.size).toBe(1);
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)!.has(subscriber)).toBeTruthy();

    unsubscribeFromManager(TestContextManager, subscriber);

    CONTEXT_SUBSCRIBERS_REGISTRY.delete(TestContextManager);
  });

  it("Should properly notify subscribers.", async () => {
    const manager: TestContextManager = registerService(TestContextManager);

    const withCheckParamsMockFn = jest.fn((context: ITestContext) => {
      expect(context.first).toBe("example");
      expect(context.second).toBe(100);
    });

    subscribeToManager(TestContextManager, withCheckParamsMockFn);

    expect(withCheckParamsMockFn).not.toHaveBeenCalled();

    manager.setContext({ first: "example", second: 100 });

    expect(withCheckParamsMockFn).not.toHaveBeenCalled();

    await nextAsyncQueue();

    expect(withCheckParamsMockFn).toHaveBeenCalled();

    withCheckParamsMockFn.mockClear();

    unsubscribeFromManager(TestContextManager, withCheckParamsMockFn);

    manager.setContext({ first: "d", second: 35 });

    await nextAsyncQueue();
    expect(withCheckParamsMockFn).not.toHaveBeenCalled();

    unRegisterService(TestContextManager);
  });
});
