import { shallow } from "enzyme";
import { createElement } from "react";

import { createScopedObserverTree } from "@/dreamstate/core/provision/scoped/createScopedObserverTree";
import { NestedContextManager, TestContextManager } from "@/fixtures";

describe("createScopedObserverTree rendering", () => {
  it("Should match snapshot", () => {
    const recursive = shallow(
      createElement(
        "div",
        {},
        createScopedObserverTree(
          [
            TestContextManager,
            NestedContextManager,
            TestContextManager
          ],
          { children: createElement("div", {}, "bottom") },
          null as any
        )
      )
    );

    expect(recursive).toMatchSnapshot();
  });
});
