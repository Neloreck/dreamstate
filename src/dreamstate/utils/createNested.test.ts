import { DreamstateError } from "@/dreamstate/core/error/DreamstateError";
import { NestedStore } from "@/dreamstate/core/storing/NestedStore";
import { EDreamstateErrorCode, TNested } from "@/dreamstate/types";
import { createNested } from "@/dreamstate/utils/createNested";
import { getCallableError } from "@/fixtures";

describe("Nested util", () => {
  it("should properly create nested objects", () => {
    const nested: TNested<{ test: boolean }> = createNested({ test: true });

    expect(Object.keys(nested)).toHaveLength(1);
    expect(nested.test).toBeTruthy();
    expect(nested.asMerged).toBeDefined();
  });

  it("should properly mutate nested objects", () => {
    const nested: TNested<{ test: boolean }> = createNested({ test: true });
    const next: TNested<{ test: boolean }> = nested.asMerged({ test: false });

    expect(Object.keys(next)).toHaveLength(1);
    expect(next.asMerged).toBeDefined();
    expect(next.test).toBeFalsy();
  });

  it("should properly declare nested objects flags", () => {
    const nested: TNested<{ test: boolean }> = createNested({ test: true });

    expect(nested instanceof NestedStore).toBeTruthy();

    const next: TNested<{ test: boolean }> = nested.asMerged({ test: false });

    expect(next instanceof NestedStore).toBeTruthy();
  });

  it("should properly throw error for non-objects initial values", () => {
    expect(() => createNested(5 as any)).toThrow(DreamstateError);
    expect(getCallableError<DreamstateError>(() => createNested(false as any)).code).toBe(
      EDreamstateErrorCode.INCORRECT_PARAMETER
    );
  });
});
