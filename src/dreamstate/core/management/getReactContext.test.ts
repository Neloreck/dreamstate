import { mount } from "enzyme";
import { Context, createElement, ReactElement } from "react";

import { ContextManager, useManager } from "@/dreamstate";
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

  it("related react context should be lazily initialized correctly with changed displayName (dev)", () => {
    expect(CONTEXT_REACT_CONTEXTS_REGISTRY.get(TestManager)).toBeUndefined();

    const contextType: Context<TAnyObject> = TestManager.REACT_CONTEXT;

    expect(CONTEXT_REACT_CONTEXTS_REGISTRY.get(TestManager)).toBeDefined();

    expect(contextType).toBeDefined();
    expect(contextType.Consumer).toBeDefined();
    expect(contextType.Provider).toBeDefined();
    expect(contextType.displayName).toBe("Dreamstate." + TestManager.name);

    CONTEXT_REACT_CONTEXTS_REGISTRY.delete(TestManager);
  });

  it("related react context should be lazily initialized correctly with changed displayName (dev)", () => {
    IS_DEV = false;
    expect(TestManager.REACT_CONTEXT.displayName).toBeUndefined();
  });

  it("should supply null value if manager is not provided", () => {
    function Consumer(): ReactElement {
      const context: ITestContext = useManager(TestManager);

      return createElement("div", {}, JSON.stringify(context));
    }

    expect(mount(createElement(Consumer)).render()).toMatchSnapshot();
  });

  it("should supply default value if manager is not provided", () => {
    class WithDefaultsManager extends ContextManager<TAnyObject> {
      public static getDefaultContext(): Partial<TAnyObject> {
        return {
          first: "unknown",
          second: -1,
        };
      }

      public readonly context: TAnyObject = {
        first: "first",
        second: 2,
        third: false,
      };
    }

    getReactContext(WithDefaultsManager);

    function Consumer(): ReactElement {
      const context: TAnyObject = useManager(WithDefaultsManager);

      return createElement("div", {}, JSON.stringify(context));
    }

    expect(mount(createElement(Consumer)).render()).toMatchSnapshot();
  });
});
