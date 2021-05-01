import { ComputedValue } from "@/dreamstate/core/storing/ComputedValue";
import { processComputed } from "@/dreamstate/core/storing/processComputed";
import { TComputed } from "@/dreamstate/types";
import { createComputed } from "@/dreamstate/utils/createComputed";

describe("processComputed method", () => {
  interface ITestContext {
    a: string;
    b: number;
    c: boolean;
    d: Array<number>;
    e: TComputed<{ odd: Array<number> }>;
  }

  it("Should correctly process computed context and replace values", () => {
    const context = {
      value: "default",
      computed: createComputed((context: { value: string }) => ({ concat: context.value + "!" }))
    };

    expect(context.value).toBe("default");
    expect(context.computed.concat).toBeUndefined();
    expect(context.computed).toBeInstanceOf(ComputedValue);

    processComputed(context);

    expect(context.value).toBe("default");
    expect(context.computed.concat).toBe("default!");
    expect(context.computed).toBeInstanceOf(ComputedValue);
  });

  it("Should properly handle default computed and always update it", () => {
    const defaultContext: ITestContext = {
      a: "1233",
      b: 123123,
      c: false,
      d: [ 1, 2, 3, 4, 5, 6, 7 ],
      e: createComputed(
        (context: ITestContext) => ({ odd: context.d.filter((it: number) => it % 2 === 0) })
      )
    };

    processComputed(defaultContext);

    expect(defaultContext.d).toHaveLength(7);
    expect(defaultContext.e.odd).toHaveLength(3);

    const first = defaultContext.e.odd;
    const firstComputed = defaultContext.e;

    defaultContext.b = 555555;

    processComputed(defaultContext);

    expect(first).not.toBe(defaultContext.e.odd);
    expect(firstComputed).not.toBe(defaultContext.e);

    const nextFirst = defaultContext.e.odd;
    const nextComputed = defaultContext.e;

    processComputed(defaultContext);

    expect(nextFirst).not.toBe(defaultContext.e.odd);
    expect(nextComputed).not.toBe(defaultContext.e);
  });

  it("Should properly handle values with memo and ignore update of other fields", () => {
    const memoContext: ITestContext = {
      a: "1233",
      b: 123123,
      c: false,
      d: [ 1, 2, 3, 4, 5, 6, 7 ],
      e: createComputed(
        (context: ITestContext) => ({ odd: context.d.filter((it: number) => it % 2 === 0) }),
        (context: ITestContext) => [ context.d ]
      )
    };

    processComputed(memoContext);

    const first = memoContext.e.odd;
    const firstComputed = memoContext.e;

    memoContext.b = 555555;

    processComputed(memoContext);

    expect(first).toBe(memoContext.e.odd);
    expect(firstComputed).toBe(memoContext.e);

    processComputed(memoContext);

    expect(first).toBe(memoContext.e.odd);
    expect(firstComputed).toBe(memoContext.e);

    memoContext.d = [ 1, 4, 12, 25 ];

    processComputed(memoContext);

    expect(first).not.toBe(memoContext.e.odd);
    expect(firstComputed).not.toBe(memoContext.e);
  });
});
