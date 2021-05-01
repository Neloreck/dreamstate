import { shallow } from "enzyme";
import { createElement } from "react";

import { createScopedObserverTreeRecursive } from "@/dreamstate/core/provision/createScopedObserverTreeRecursive";
import { NestedContextManager, TestContextManager } from "@/fixtures";

describe("createScopedObserverTreeRecursive rendering", () => {
  it("Should match snapshot", () => {
    const recursive = shallow(
      createElement(
        "div",
        {},
        createScopedObserverTreeRecursive(
          [
            TestContextManager,
            NestedContextManager,
            TestContextManager
          ],
          { children: createElement("div", {}, "bottom") }
        )
      )
    );

    expect(recursive).toMatchSnapshot();
  });
});
