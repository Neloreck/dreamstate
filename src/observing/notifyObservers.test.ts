import { notifyObservers } from "./notifyObservers";
import {
  addServiceObserver,
  nextAsyncQueue,
  registerService,
  removeServiceObserver,
  unRegisterService
} from "../testing";
import { subscribeToManager, unsubscribeFromManager, getCurrentContext } from "../registry";
import { CONTEXT_STATES_REGISTRY } from "../internals";

import { ITestContext, TestContextManager } from "@Tests/../fixtures";

describe("notifyObservers method functionality.", () => {
  it("Should correctly set nextState for managers.", () => {
    const manager: TestContextManager = registerService(TestContextManager);

    expect(CONTEXT_STATES_REGISTRY.has(TestContextManager)).toBeTruthy();

    const currentContext: ITestContext = getCurrentContext(TestContextManager)!;

    expect(currentContext.first).toBe("first");
    expect(currentContext.second).toBe(2);
    expect(currentContext.third).toBe(false);

    expect(currentContext).toBe(CONTEXT_STATES_REGISTRY.get(TestContextManager));

    manager.context.first = "one";
    manager.context.second = 1;
    manager.context.third = true;

    notifyObservers(manager);

    expect(CONTEXT_STATES_REGISTRY.has(TestContextManager)).toBeTruthy();

    const nextContext: ITestContext = getCurrentContext(TestContextManager)!;

    expect(nextContext).toBe(CONTEXT_STATES_REGISTRY.get(TestContextManager));
    expect(currentContext.first).toBe("one");
    expect(currentContext.second).toBe(1);
    expect(currentContext.third).toBe(true);

    unRegisterService(TestContextManager);
  });

  it("Should correctly notify subscribers.", () => {
    const testContextManager: TestContextManager = registerService(TestContextManager)!;
    const observer = jest.fn();

    addServiceObserver(TestContextManager, observer);
    notifyObservers(testContextManager);

    expect(observer).toHaveBeenCalled();

    removeServiceObserver(TestContextManager, observer);
    unRegisterService(TestContextManager);
  });

  it("Should correctly notify subscribers.", async () => {
    const testContextManager: TestContextManager = registerService(TestContextManager)!;
    const subscriber = jest.fn();

    subscribeToManager(TestContextManager, subscriber);
    notifyObservers(testContextManager);

    expect(subscriber).not.toHaveBeenCalled();

    await nextAsyncQueue();

    expect(subscriber).toHaveBeenCalled();

    unsubscribeFromManager(TestContextManager, subscriber);
    unRegisterService(TestContextManager);
  });
});
