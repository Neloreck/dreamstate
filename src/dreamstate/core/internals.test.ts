import {
  EMPTY_ARR,
  CONTEXT_REACT_CONTEXTS_REGISTRY,
  QUERY_METADATA_SYMBOL,
  SIGNAL_METADATA_SYMBOL,
  SCOPE_SYMBOL,
  SIGNALING_HANDLER_SYMBOL
} from "@/dreamstate/core/internals";

describe("Dreamstate internals", () => {
  it("Internals should be initialized", () => {
    expect(EMPTY_ARR).toBeInstanceOf(Array);
    expect(EMPTY_ARR).toHaveLength(0);
    expect(typeof QUERY_METADATA_SYMBOL).toBe("symbol");
    expect(typeof SIGNAL_METADATA_SYMBOL).toBe("symbol");
    expect(typeof SCOPE_SYMBOL).toBe("symbol");
    expect(typeof SIGNALING_HANDLER_SYMBOL).toBe("symbol");
    expect(CONTEXT_REACT_CONTEXTS_REGISTRY).toBeInstanceOf(WeakMap);
  });
});
