import { TMutable } from "../src/types";
import { createMutable } from "../src/utils";
import { NESTED_STORE_KEY } from "../src/internals";

describe("Loadable util.", () => {
  it("Should properly create loadable objects.", () => {
    const mutable: TMutable<{ test: boolean }> = createMutable({ test: true });

    expect(Object.keys(mutable)).toHaveLength(2);
    expect(mutable.test).toBeTruthy();
  });

  it("Should properly mutate loadable objects.", () => {
    const mutable: TMutable<{ test: boolean }> = createMutable({ test: true });
    const next: TMutable<{ test: boolean }> = mutable.asMerged({ test: false });

    expect(Object.keys(next)).toHaveLength(2);
    expect(next.test).toBeFalsy();
  });

  it("Should properly declare mutable objects flags.", () => {
    const mutable: TMutable<{ test: boolean }> = createMutable({ test: true });

    expect(mutable[NESTED_STORE_KEY]).toBeTruthy();

    const next: TMutable<{ test: boolean }> = mutable.asMerged({ test: false });

    expect(next[NESTED_STORE_KEY]).toBeTruthy();
  });
});
