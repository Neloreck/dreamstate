import { Context } from "react";

import { CONTEXT_REACT_CONTEXTS_REGISTRY } from "../internals";

import { TestContextManager } from "@Tests/../fixtures";

describe("getReactContext method.", () => {
  it("Related react context should be lazily initialized correctly with changed displayName.", () => {
    expect(CONTEXT_REACT_CONTEXTS_REGISTRY.get(TestContextManager)).toBeUndefined();

    const contextType: Context<object> = TestContextManager.REACT_CONTEXT;

    expect(CONTEXT_REACT_CONTEXTS_REGISTRY.get(TestContextManager)).toBeDefined();

    expect(contextType).not.toBeUndefined();
    expect(contextType.Consumer).not.toBeUndefined();
    expect(contextType.Provider).not.toBeUndefined();
    expect(contextType.displayName).toBe("DS." + TestContextManager.name);

    CONTEXT_REACT_CONTEXTS_REGISTRY.delete(TestContextManager);
  });
});
