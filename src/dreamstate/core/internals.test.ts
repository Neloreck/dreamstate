import {
  EMPTY_ARR,
  CONTEXT_REACT_CONTEXTS_REGISTRY,
} from "@/dreamstate/core/internals";

describe("Dreamstate internals", () => {
  it("Should contain only listed objects", () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const internals = require("./internals");

    expect(Object.keys(internals)).toHaveLength(12);
  });

  it("Internals should be initialized", () => {
    expect(EMPTY_ARR).toBeInstanceOf(Array);
    expect(EMPTY_ARR).toHaveLength(0);
    expect(CONTEXT_REACT_CONTEXTS_REGISTRY).toBeInstanceOf(WeakMap);
  });
});
