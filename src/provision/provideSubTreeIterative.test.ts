import { createElement } from "react";
import { shallow } from "enzyme";

import { provideSubTreeIterative, provideSubTreeRecursive } from "./index";
import { registerService, unRegisterService } from "../test-utils";

import { NestedContextManager, TestContextManager, TestSingleContextManager } from "@Tests/../fixtures";

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
