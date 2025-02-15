import { mount } from "enzyme";
import { Context, createElement, ReactElement } from "react";

import { useManager } from "@/dreamstate";
import { CONTEXT_REACT_CONTEXTS_REGISTRY } from "@/dreamstate/core/internals";
import { getReactContext } from "@/dreamstate/core/management/getReactContext";
import { TAnyObject } from "@/dreamstate/types";
import { ITestContext, TestManager } from "@/fixtures";

describe("getReactContext method functionality", () => {
  /**
   * Clear possible existing entry of manager for testing.
   */
  beforeEach(() => {
    CONTEXT_REACT_CONTEXTS_REGISTRY.delete(TestManager);
  });

  it("Related react context should be lazily initialized correctly with changed displayName", () => {
    expect(CONTEXT_REACT_CONTEXTS_REGISTRY.get(TestManager)).toBeUndefined();

    const contextType: Context<TAnyObject> = TestManager.REACT_CONTEXT;

    expect(CONTEXT_REACT_CONTEXTS_REGISTRY.get(TestManager)).toBeDefined();

    expect(contextType).toBeDefined();
    expect(contextType.Consumer).toBeDefined();
    expect(contextType.Provider).toBeDefined();
    expect(contextType.displayName).toBe("DS." + TestManager.name);

    CONTEXT_REACT_CONTEXTS_REGISTRY.delete(TestManager);
  });

  it("should supply null value if manager is not provided", () => {
    function Consumer(): ReactElement {
      const context: ITestContext = useManager(TestManager);

      return createElement("div", {}, JSON.stringify(context));
    }

    expect(mount(createElement(Consumer)).render()).toMatchSnapshot();
  });

  it("should supply default value if manager is not provided", () => {
    getReactContext(TestManager, { first: "default-state-test", second: -1000 });

    function Consumer(): ReactElement {
      const context: ITestContext = useManager(TestManager);

      return createElement("div", {}, JSON.stringify(context));
    }

    expect(mount(createElement(Consumer)).render()).toMatchSnapshot();
  });
});
