import { shallow } from "enzyme";
import { createElement } from "react";

import { createScopedObserverTree } from "@/dreamstate/core/provision/scoped/createScopedObserverTree";
import { NestedManager, TestManager } from "@/fixtures";

describe("createScopedObserverTree rendering", () => {
  it("should match snapshot", () => {
    const recursive = shallow(
      createElement(
        "div",
        {},
        createScopedObserverTree(
          [ TestManager, NestedManager, TestManager ],
          { children: createElement("div", {}, "bottom") },
          null as any
        )
      )
    );

    expect(recursive).toMatchSnapshot();
  });
});
