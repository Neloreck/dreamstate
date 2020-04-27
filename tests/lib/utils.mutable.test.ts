import { TMutable } from "@Lib/types";
import { createMutable, NestedStore } from "@Lib/utils";

describe("Mutable util.", () => {
  it("Should properly create mutable objects.", () => {
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

    expect(mutable instanceof NestedStore).toBeTruthy();

    const next: TMutable<{ test: boolean }> = mutable.asMerged({ test: false });

    expect(next instanceof NestedStore).toBeTruthy();
  });

  it("Should properly throw error for non-objects initial values.", () => {
    expect(() => createMutable(5 as any)).toThrow(TypeError);
  });
});
