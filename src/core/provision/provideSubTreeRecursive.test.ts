
import { provideSubTreeIterative } from "@Lib/core/provision/provideSubTreeIterative";
import { provideSubTreeRecursive } from "@Lib/core/provision/provideSubTreeRecursive";
import { NestedContextManager, TestContextManager, TestSingleContextManager } from "@Lib/fixtures";
import { registerService } from "@Lib/test-utils/registry/registerService";
import { unRegisterService } from "@Lib/test-utils/registry/unRegisterService";
import { shallow } from "enzyme";
import { createElement } from "react";

describe("provideSubTreeRecursive rendering.", () => {
  beforeAll(() => {
    registerService(TestContextManager);
    registerService(NestedContextManager);
    registerService(TestSingleContextManager);
  });

  afterAll(() => {
    unRegisterService(TestContextManager);
    unRegisterService(NestedContextManager);
    unRegisterService(TestSingleContextManager, true);
  });

  const provide = (method: typeof provideSubTreeIterative | typeof provideSubTreeRecursive) => {
    shallow(
      createElement(
        "div",
        {},
        method(
          createElement("div", {}, "bottom"),
          [
            TestContextManager,
            NestedContextManager,
            TestContextManager
          ],
          0
        )
      )
    );
  };

  it("Should match snapshot.", () => {
    const recursive = provide(provideSubTreeRecursive);

    expect(recursive).toMatchSnapshot();
  });

  it("Should be same as iterative implementation.", () => {
    const iterative = provide(provideSubTreeIterative);
    const recursive = provide(provideSubTreeRecursive);

    expect(recursive).toEqual(iterative);
  });
});
