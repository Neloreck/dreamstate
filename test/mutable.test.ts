import { TMutable } from "../src/types";
import { createMutable } from "../src/utils";
import { MUTABLE_KEY } from "../src/internals";

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

  it("Should properly declare mutable objects flaga.", () => {
    const mutable: TMutable<{ test: boolean }> = createMutable({ test: true });

    expect(mutable[MUTABLE_KEY]).toBeTruthy();

    const next: TMutable<{ test: boolean }> = mutable.asMerged({ test: false });

    expect(next[MUTABLE_KEY]).toBeTruthy();
  });
});