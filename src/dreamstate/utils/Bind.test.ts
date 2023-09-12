import { Bind } from "@/dreamstate/utils/Bind";

describe("@Bind decorator", () => {
  class Base {

    public field: number = 0;

    // @ts-ignore case for pure JS.
    @Bind()
    public boundValue: string = "bound";

    @Bind()
    public method(): this {
      return this;
    }

  }

  class Extending extends Base {}

  it("should correctly bind methods to instances", () => {
    const first: Base = new Base();
    const second: Base = new Base();

    expect(first.method()).toBe(first);
    expect(second.method.call(null)).toBe(second);
    expect(second.method()).not.toBe(first.method());
  });

  it("should correctly work for inherited classes", () => {
    const base: Base = new Base();
    const extending: Extending = new Base();

    expect(extending.method()).toBe(extending);
    expect(extending.method.call(null)).toBe(extending);
    expect(extending.method()).not.toBe(base.method());
  });

  it("should not allow re-assigning of bound methods after bind", () => {
    const base: Base = new Base();

    expect(base.method()).toBe(base);

    // It will ignore later references since it is not writable.
    expect(() => (base.method = () => 1 as any)).toThrow(TypeError);

    expect(base.method()).toBe(base);
    expect(base.method.call(null)).toBe(base);

    const newInstance: Base = new Base();

    expect(newInstance.method.call(null)).toBe(newInstance);
  });

  it("should allow to re-assign method before first usage. Special case - testing of classes", () => {
    const base: Base = new Base();

    expect(() => (base.method = () => 1 as any)).toThrow();
    expect(base.method()).toBe(base);
    expect(() => (base.method = () => 2 as any)).toThrow();

    expect(() => {
      Object.defineProperty(base, "method", {
        value: () => 50,
        writable: false
      });
    }).not.toThrow();

    expect(base.method()).toBe(50);
  });
});
