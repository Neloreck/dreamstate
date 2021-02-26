import { Context } from "react";

import { CONTEXT_REACT_CONTEXTS_REGISTRY } from "@/dreamstate/core/internals";
import { TAnyObject } from "@/dreamstate/types";
import { TestContextManager } from "@/fixtures";

describe("getReactContext method", () => {
  it("Related react context should be lazily initialized correctly with changed displayName", () => {
    expect(CONTEXT_REACT_CONTEXTS_REGISTRY.get(TestContextManager)).toBeUndefined();

    const contextType: Context<TAnyObject> = TestContextManager.REACT_CONTEXT;

    expect(CONTEXT_REACT_CONTEXTS_REGISTRY.get(TestContextManager)).toBeDefined();

    expect(contextType).not.toBeUndefined();
    expect(contextType.Consumer).not.toBeUndefined();
    expect(contextType.Provider).not.toBeUndefined();
    expect(contextType.displayName).toBe("DS." + TestContextManager.name);

    CONTEXT_REACT_CONTEXTS_REGISTRY.delete(TestContextManager);
  });
});