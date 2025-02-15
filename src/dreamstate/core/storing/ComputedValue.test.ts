import { shouldObserversUpdate } from "@/dreamstate/core/services/shouldObserversUpdate";
import { ComputedValue } from "@/dreamstate/core/storing/ComputedValue";
import { processComputed } from "@/dreamstate/core/storing/processComputed";
import { TComputed } from "@/dreamstate/types";

describe("Computed value class", () => {
  it("should not be checked when comparing values before manager update", () => {
    interface IContext {
      a: number;
      b: number;
      c: TComputed<{ r: number }>;
    }

    const firstComputedValue: TComputed<{ r: number }> = new ComputedValue(({ a, b }: IContext) => ({
      r: a * b,
    })) as any as TComputed<{ r: number }>;
    const secondComputedValue: TComputed<{ r: number }> = new ComputedValue(({ a, b }: IContext) => ({
      r: a * b,
    })) as any as TComputed<{ r: number }>;

    const context: IContext = { a: 15, b: 100, c: firstComputedValue };
    const sameButWithNewRef: IContext = { ...context, a: 15, b: 100 };
    const updated: IContext = {
      ...context,
      a: 100,
      b: 1,
      c: secondComputedValue,
    };

    processComputed(context);
    processComputed(sameButWithNewRef);
    processComputed(updated);

    expect(shouldObserversUpdate(context, sameButWithNewRef)).toBeFalsy();
    expect(shouldObserversUpdate(context, updated)).toBeTruthy();
    expect(shouldObserversUpdate(sameButWithNewRef, updated)).toBeTruthy();

    expect(context.c.r).toBe(1500);

    expect(sameButWithNewRef.c.r).toBe(1500);

    expect(updated.c.r).toBe(100);
  });
});
