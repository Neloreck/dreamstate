import { createElement } from "react";
import { shallow } from "enzyme";

import { provideSubTreeIterative, provideSubTreeRecursive } from "./index";
import { registerWorker, unRegisterWorker } from "../test-utils";

import { NestedContextManager, TestContextManager, TestSingleContextManager } from "@Tests/assets";

describe("provideSubTreeIterative rendering.", () => {
  beforeAll(() => {
    registerWorker(TestContextManager);
    registerWorker(NestedContextManager);
    registerWorker(TestSingleContextManager);
  });

  afterAll(() => {
    unRegisterWorker(TestContextManager);
    unRegisterWorker(NestedContextManager);
    unRegisterWorker(TestSingleContextManager, true);
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
