import { mount, render } from "enzyme";
import { createElement } from "react";
import { act } from "react-dom/test-utils";

import { useManager } from "@/dreamstate";
import { createProvider } from "@/dreamstate/core/provision/createProvider";
import { getCurrent } from "@/dreamstate/test-utils/registry/getCurrent";
import { TestContextManager } from "@/fixtures";

describe("React tree for provided and consumed components", () => {
  it("Should correctly update subscribed to functional provider elements view", () => {
    const getRoot = () => (
      createElement(
        createProvider([ TestContextManager ]),
        {},
        createElement(function() {
          const context = useManager(TestContextManager);

          return createElement("div", {}, JSON.stringify(context));
        })
      )
    );

    expect(render(getRoot())).toMatchSnapshot();

    const reactTree = mount(getRoot());
    const testContextManager: TestContextManager | null = getCurrent(TestContextManager);

    expect(testContextManager).not.toBeNull();

    act(() => {
      testContextManager!.setContext({ first: "updated", second: 101010, third: true });
    });

    expect(testContextManager!.context.first).toBe("updated");
    expect(testContextManager!.context.second).toBe(101010);
    expect(testContextManager!.context.third).toBe(true);
    expect(render(getRoot())).toMatchSnapshot();

    reactTree.unmount();
  });
});
