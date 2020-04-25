import { createElement } from "react";
import { shallow } from "enzyme";

import { provideSubTreeIterative, provideSubTreeRecursive } from "@Lib/observing";

import { NestedContextManager, TestContextManager, TestSingleContextManager } from "@Tests/assets";
import { registerManagerClass, unRegisterManagerClass } from "@Tests/helpers";

describe("ProvideSubTree should properly render in declared order.", () => {
  beforeAll(() => {
    registerManagerClass(TestContextManager);
    registerManagerClass(NestedContextManager);
    registerManagerClass(TestSingleContextManager);
  });

  afterAll(() => {
    unRegisterManagerClass(TestContextManager);
    unRegisterManagerClass(NestedContextManager);
    unRegisterManagerClass(TestSingleContextManager, true);
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
