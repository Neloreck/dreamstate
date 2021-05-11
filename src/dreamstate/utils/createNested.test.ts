import { NestedStore } from "@/dreamstate/core/storing/NestedStore";
import { TNested } from "@/dreamstate/types";
import { createNested } from "@/dreamstate/utils/createNested";

describe("Nested util", () => {
  it("Should properly create nested objects", () => {
    const nested: TNested<{ test: boolean }> = createNested({ test: true });

    expect(Object.keys(nested)).toHaveLength(1);
    expect(nested.test).toBeTruthy();
    expect(nested.asMerged).toBeDefined();
  });

  it("Should properly mutate nested objects", () => {
    const nested: TNested<{ test: boolean }> = createNested({ test: true });
    const next: TNested<{ test: boolean }> = nested.asMerged({ test: false });

    expect(Object.keys(next)).toHaveLength(1);
    expect(next.asMerged).toBeDefined();
    expect(next.test).toBeFalsy();
  });

  it("Should properly declare nested objects flags", () => {
    const nested: TNested<{ test: boolean }> = createNested({ test: true });

    expect(nested instanceof NestedStore).toBeTruthy();

    const next: TNested<{ test: boolean }> = nested.asMerged({ test: false });

    expect(next instanceof NestedStore).toBeTruthy();
  });

  it("Should properly throw error for non-objects initial values", () => {
    expect(() => createNested(5 as any)).toThrow(TypeError);
  });
});
