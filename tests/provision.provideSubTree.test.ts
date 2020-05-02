import { createElement } from "react";
import { shallow } from "enzyme";

import { provideSubTreeIterative, provideSubTreeRecursive } from "@Lib/observing";
import { registerWorker, unRegisterWorker } from "@Lib/test-utils";

import { NestedContextManager, TestContextManager, TestSingleContextManager } from "@Tests/assets";

describe("ProvideSubTree should properly render in declared order.", () => {
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

  it("Implementations must return same results.", () => {
    const iterative = shallow(
      createElement(
        "div",
        {},
        provideSubTreeIterative(createElement("div", {}, "bottom"), [
          TestContextManager,
          NestedContextManager,
          TestContextManager
        ])
      )
    );
    const recursive = shallow(
      createElement(
        "div",
        {},
        provideSubTreeRecursive(0, createElement("div", {}, "bottom"), [
          TestContextManager,
          NestedContextManager,
          TestContextManager
        ])
      )
    );

    expect(recursive).toMatchSnapshot();
    expect(iterative).toMatchSnapshot();
    expect(recursive).toEqual(iterative);
  });
});
