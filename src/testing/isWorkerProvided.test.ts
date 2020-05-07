import { addManagerObserver, isWorkerProvided, registerWorker, removeManagerObserver } from "../test-utils";

import { TestContextManager } from "@Tests/assets";

describe("Register worker test util.", () => {
  it("Should properly detect if worker is provided.", () => {
    const first = jest.fn();
    const second = jest.fn();

    expect(isWorkerProvided(TestContextManager)).toBeFalsy();

    registerWorker(TestContextManager);

    expect(isWorkerProvided(TestContextManager)).toBeFalsy();

    addManagerObserver(TestContextManager, first);

    expect(isWorkerProvided(TestContextManager)).toBeTruthy();

    addManagerObserver(TestContextManager, second);

    expect(isWorkerProvided(TestContextManager)).toBeTruthy();

    removeManagerObserver(TestContextManager, first);

    expect(isWorkerProvided(TestContextManager)).toBeTruthy();

    removeManagerObserver(TestContextManager, second);

    expect(isWorkerProvided(TestContextManager)).toBeFalsy();
  });
});
