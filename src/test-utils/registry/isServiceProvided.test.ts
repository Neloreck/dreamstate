import { TestContextManager } from "@Lib/fixtures";
import { addServiceObserver } from "@Lib/test-utils/registry/addServiceObserver";
import { isServiceProvided } from "@Lib/test-utils/registry/isServiceProvided";
import { registerService } from "@Lib/test-utils/registry/registerService";
import { removeServiceObserver } from "@Lib/test-utils/registry/removeServiceObserver";

describe("Register service test util.", () => {
  it("Should properly detect if service is provided.", () => {
    const first = jest.fn();
    const second = jest.fn();

    expect(isServiceProvided(TestContextManager)).toBeFalsy();

    registerService(TestContextManager);

    expect(isServiceProvided(TestContextManager)).toBeFalsy();

    addServiceObserver(TestContextManager, first);

    expect(isServiceProvided(TestContextManager)).toBeTruthy();

    addServiceObserver(TestContextManager, second);

    expect(isServiceProvided(TestContextManager)).toBeTruthy();

    removeServiceObserver(TestContextManager, first);

    expect(isServiceProvided(TestContextManager)).toBeTruthy();

    removeServiceObserver(TestContextManager, second);

    expect(isServiceProvided(TestContextManager)).toBeFalsy();
  });
});
