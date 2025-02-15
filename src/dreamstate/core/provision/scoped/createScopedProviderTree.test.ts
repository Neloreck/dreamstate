import { shallow } from "enzyme";
import { createElement } from "react";

import { createScopedProviderTree } from "@/dreamstate/core/provision/scoped/createScopedProviderTree";
import { TUninitializedValue } from "@/dreamstate/types";
import { NestedManager, TestManager } from "@/fixtures";

describe("createScopedObserverTree rendering", () => {
  it("should match snapshot", () => {
    const recursive = shallow(
      createElement(
        "div",
        {},
        createScopedProviderTree(
          [TestManager, NestedManager, TestManager],
          { children: createElement("div", {}, "bottom") },
          null as TUninitializedValue
        )
      )
    );

    expect(recursive).toMatchSnapshot();
  });
});
