import { shallow } from "enzyme";
import { createElement } from "react";

import { provideSubTreeIterative } from "@/dreamstate/core/provision/provideSubTreeIterative";
import { provideSubTreeRecursive } from "@/dreamstate/core/provision/provideSubTreeRecursive";
import { registerService } from "@/dreamstate/test-utils/registry/registerService";
import { unRegisterService } from "@/dreamstate/test-utils/registry/unRegisterService";
import { NestedContextManager, TestContextManager } from "@/fixtures";

describe("provideSubTreeIterative rendering", () => {
  beforeAll(() => {
    registerService(TestContextManager);
    registerService(NestedContextManager);
  });

  afterAll(() => {
    unRegisterService(TestContextManager);
    unRegisterService(NestedContextManager);
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

  it("Should match snapshot", () => {
    const iterative = provide(provideSubTreeIterative);

    expect(iterative).toMatchSnapshot();
  });

  it("Should be same as iterative implementation", () => {
    const iterative = provide(provideSubTreeIterative);
    const recursive = provide(provideSubTreeRecursive);

    expect(recursive).toEqual(iterative);
  });
});
