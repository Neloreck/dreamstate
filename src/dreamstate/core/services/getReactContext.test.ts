import { Context } from "react";

import { CONTEXT_REACT_CONTEXTS_REGISTRY } from "@/dreamstate/core/internals";
import { TAnyObject } from "@/dreamstate/types";
import { TestManager } from "@/fixtures";

describe("getReactContext method", () => {
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
});
