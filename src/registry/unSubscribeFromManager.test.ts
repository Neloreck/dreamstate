import { CONTEXT_SUBSCRIBERS_REGISTRY } from "@Lib/internals";
import { subscribeToManager } from "@Lib/registry/subscribeToManager";
import { unsubscribeFromManager } from "@Lib/registry/unSubscribeFromManager";
import { TestContextManager, TestContextService } from "@Lib/fixtures";

describe("unSubscribeFromManager method functionality.", () => {
  it("Should properly remove subscribers from registry.", () => {
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

  it("Should not work before registering.", () => {
    expect(() => unsubscribeFromManager(TestContextManager, () => {})).toThrow(Error);
  });

  it("Should not work with non-ContextManager classes.", () => {
    expect(() => unsubscribeFromManager(TestContextService as any, () => {})).toThrow(TypeError);
    expect(() => unsubscribeFromManager(class AnyClass {} as any, () => {})).toThrow(TypeError);
  });
});
