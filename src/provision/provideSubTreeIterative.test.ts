import { createElement } from "react";
import { shallow } from "enzyme";

import { provideSubTreeIterative } from "@Lib/provision/provideSubTreeIterative";
import { provideSubTreeRecursive } from "@Lib/provision/provideSubTreeRecursive";
import { registerService } from "@Lib/testing/registerService";
import { unRegisterService } from "@Lib/testing/unRegisterService";
import { NestedContextManager, TestContextManager, TestSingleContextManager } from "@Lib/fixtures";

describe("provideSubTreeIterative rendering.", () => {
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
    const iterative = provide(provideSubTreeIterative);

    expect(iterative).toMatchSnapshot();
  });

  it("Should be same as iterative implementation.", () => {
    const iterative = provide(provideSubTreeIterative);
    const recursive = provide(provideSubTreeRecursive);

    expect(recursive).toEqual(iterative);
  });
});
