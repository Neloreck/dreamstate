import {
  CONTEXT_REACT_CONTEXTS_REGISTRY,
  SCOPE_SYMBOL,
  SIGNALING_HANDLER_SYMBOL,
  SIGNAL_METADATA_REGISTRY,
} from "@/dreamstate/core/internals";

describe("Dreamstate internals", () => {
  it("Internals should be initialized", () => {
    expect(typeof SCOPE_SYMBOL).toBe("symbol");
    expect(typeof SIGNALING_HANDLER_SYMBOL).toBe("symbol");
    expect(CONTEXT_REACT_CONTEXTS_REGISTRY).toBeInstanceOf(WeakMap);
    expect(SIGNAL_METADATA_REGISTRY).toBeInstanceOf(WeakMap);
  });
});
