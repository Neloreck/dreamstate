import { render } from "enzyme";
import { createElement } from "react";

import { useManager } from "@/dreamstate";
import { mockContextProvider } from "@/dreamstate/test-utils/provision/mockContextProvider";
import { mockManagerInitialContext } from "@/dreamstate/test-utils/registry/mockManagerInitialContext";
import { mockScope } from "@/dreamstate/test-utils/registry/mockScope";
import { TestManager } from "@/fixtures";

describe("mockContextProvider util", () => {
  it("should correctly provide mocked state for nested components", () => {
    const Provider = mockContextProvider(
      [TestManager],
      {},
      mockScope({
        applyInitialContexts: [mockManagerInitialContext(TestManager, { first: "this test", second: 1000 })],
      })
    );

    const SomeComponent = ({ testContext: { first, second, third } = useManager(TestManager) }) => {
      expect(first).toBe("this test");
      expect(second).toBe(1000);
      expect(third).toBe(false);

      return createElement("div", {}, [
        createElement("span", { key: 1 }, first),
        createElement("span", { key: 2 }, second),
        createElement("span", { key: 3 }, JSON.stringify(third)),
      ]);
    };

    const tree = render(createElement(Provider, {}, createElement(SomeComponent)));

    expect(tree).toMatchSnapshot();
  });
});
