import { createElement } from "react";
import { shallow } from "enzyme";

import { provideSubTreeIterative, provideSubTreeRecursive } from "@Lib/observing";

import { NestedContextManager, TestContextManager, TestSingleContextManager } from "@Tests/assets";
import { registerWorkerClass, unRegisterWorkerClass } from "@Tests/helpers";

describe("ProvideSubTree should properly render in declared order.", () => {
  beforeAll(() => {
    registerWorkerClass(TestContextManager);
    registerWorkerClass(NestedContextManager);
    registerWorkerClass(TestSingleContextManager);
  });

  afterAll(() => {
    unRegisterWorkerClass(TestContextManager);
    unRegisterWorkerClass(NestedContextManager);
    unRegisterWorkerClass(TestSingleContextManager, true);
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
