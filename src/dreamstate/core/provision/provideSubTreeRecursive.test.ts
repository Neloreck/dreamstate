import { shallow } from "enzyme";
import { createElement } from "react";

import { provideSubTreeRecursive } from "@/dreamstate/core/provision/provideSubTreeRecursive";
import { registerService } from "@/dreamstate/test-utils/registry/registerService";
import { unRegisterService } from "@/dreamstate/test-utils/registry/unRegisterService";
import { NestedContextManager, TestContextManager } from "@/fixtures";

describe("provideSubTreeRecursive rendering", () => {
  beforeAll(() => {
    registerService(TestContextManager);
    registerService(NestedContextManager);
  });

  afterAll(() => {
    unRegisterService(TestContextManager);
    unRegisterService(NestedContextManager);
  });

  const provide = (method: typeof provideSubTreeRecursive) => {
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

  it("Should match snapshot", () => {
    const recursive = provide(provideSubTreeRecursive);

    expect(recursive).toMatchSnapshot();
  });
});
