import { CONTEXT_SUBSCRIBERS_REGISTRY } from "../internals";
import { subscribeToManager } from "./subscribeToManager";
import { unsubscribeFromManager } from "./unSubscribeFromManager";

import { TestContextManager, TestContextWorker } from "@Tests/assets";

describe("subscribeToManager method functionality.", () => {
  it("Should properly add subscribers to registry.", () => {
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.has(TestContextManager)).toBeFalsy();

    CONTEXT_SUBSCRIBERS_REGISTRY.set(TestContextManager, new Set());

    const subscriber = jest.fn();

    subscribeToManager(TestContextManager, subscriber);

    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager).size).toBe(1);
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)!.has(subscriber)).toBeTruthy();

    unsubscribeFromManager(TestContextManager, subscriber);

    CONTEXT_SUBSCRIBERS_REGISTRY.delete(TestContextManager);
  });

  it("Should not work before registering.", () => {
    expect(() => subscribeToManager(TestContextManager, () => {})).toThrow(Error);
  });

  it("Should not work with non-ContextManager classes.", () => {
    expect(() => subscribeToManager(TestContextWorker, () => {})).toThrow(TypeError);
    expect(() => subscribeToManager(class AnyClass {} as any, () => {})).toThrow(TypeError);
  });
});
