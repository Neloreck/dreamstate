import { CONTEXT_SUBSCRIBERS_REGISTRY } from "@/dreamstate/core/internals";
import { subscribeToManager } from "@/dreamstate/core/registry/subscribeToManager";
import { unsubscribeFromManager } from "@/dreamstate/core/registry/unSubscribeFromManager";
import { TestContextManager, TestContextService } from "@/fixtures";

describe("unSubscribeFromManager method functionality", () => {
  it("Should properly remove subscribers from registry", () => {
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.has(TestContextManager)).toBeFalsy();

    CONTEXT_SUBSCRIBERS_REGISTRY.set(TestContextManager, new Set());

    const first = jest.fn();
    const second = jest.fn();

    subscribeToManager(TestContextManager, first);
    subscribeToManager(TestContextManager, second);

    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)!.size).toBe(2);

    unsubscribeFromManager(TestContextManager, first);

    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)!.size).toBe(1);

    unsubscribeFromManager(TestContextManager, second);

    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)!.size).toBe(0);

    CONTEXT_SUBSCRIBERS_REGISTRY.delete(TestContextManager);
  });

  it("Should not work before registering", () => {
    expect(() => unsubscribeFromManager(TestContextManager, () => {})).toThrow(Error);
  });

  it("Should not work with non-ContextManager classes", () => {
    expect(() => unsubscribeFromManager(TestContextService as any, () => {})).toThrow(TypeError);
    expect(() => unsubscribeFromManager(class AnyClass {} as any, () => {})).toThrow(TypeError);
  });
});