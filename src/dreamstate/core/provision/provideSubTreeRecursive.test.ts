import { shallow } from "enzyme";
import { createElement } from "react";

import { provideSubTreeIterative } from "@/dreamstate/core/provision/provideSubTreeIterative";
import { provideSubTreeRecursive } from "@/dreamstate/core/provision/provideSubTreeRecursive";
import { registerService } from "@/dreamstate/test-utils/registry/registerService";
import { unRegisterService } from "@/dreamstate/test-utils/registry/unRegisterService";
import { NestedContextManager, TestContextManager, TestSingleContextManager } from "@/fixtures";

describe("provideSubTreeRecursive rendering", () => {
  beforeAll(() => {
    registerService(TestContextManager);
    registerService(NestedContextManager);
    registerService(TestSingleContextManager);
  });

  afterAll(() => {
    unRegisterService(TestContextManager);
    unRegisterService(NestedContextManager);
    unRegisterService(TestSingleContextManager, true);
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
    const recursive = provide(provideSubTreeRecursive);

    expect(recursive).toMatchSnapshot();
  });

  it("Should be same as iterative implementation", () => {
    const iterative = provide(provideSubTreeIterative);
    const recursive = provide(provideSubTreeRecursive);

    expect(recursive).toEqual(iterative);
  });
});
