import { CONTEXT_SUBSCRIBERS_REGISTRY } from "../internals";
import { subscribeToManager } from "./subscribeToManager";
import { unsubscribeFromManager } from "./unSubscribeFromManager";

import { TestContextManager, TestContextWorker } from "@Tests/assets";

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
    expect(() => unsubscribeFromManager(TestContextWorker as any, () => {})).toThrow(TypeError);
    expect(() => unsubscribeFromManager(class AnyClass {} as any, () => {})).toThrow(TypeError);
  });
});