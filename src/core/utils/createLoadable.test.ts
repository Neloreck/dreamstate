import { ILoadable } from "@Lib/core/types";
import { asFailed, asLoading, asReady, asUpdated, createLoadable } from "@Lib/core/utils/createLoadable";
import { NestedStore } from "@Lib/core/utils/NestedStore";

describe("Loadable util.", () => {
  it("Should properly create loadable objects.", () => {
    const loadableValue: number = 10;
    const loadableError: Error = new Error("testError");
    const loadable: ILoadable<number> = createLoadable(loadableValue);

    expect(Object.keys(loadable)).toHaveLength(7);

    expect(loadable.error).toBeNull();
    expect(loadable.isLoading).toBeFalsy();
    expect(loadable.value).toBe(loadableValue);

    expect(typeof loadable.asFailed).toBe("function");
    expect(typeof loadable.asLoading).toBe("function");
    expect(typeof loadable.asReady).toBe("function");
    expect(typeof loadable.asUpdated).toBe("function");

    const loadableWithOtherDefaults: ILoadable<number> = createLoadable(loadableValue, true);

    expect(Object.keys(loadableWithOtherDefaults)).toHaveLength(7);

    expect(loadableWithOtherDefaults.error).toBeNull();
    expect(loadableWithOtherDefaults.isLoading).toBeTruthy();
    expect(loadableWithOtherDefaults.value).toBe(loadableValue);

    const loadableWithErrorDefaults: ILoadable<number> = createLoadable(loadableValue, true, loadableError);

    expect(Object.keys(loadableWithErrorDefaults)).toHaveLength(7);

    expect(loadableWithErrorDefaults.isLoading).toBeTruthy();
    expect(loadableWithErrorDefaults.value).toBe(loadableValue);
    expect(loadableWithErrorDefaults.error).toBeInstanceOf(Error);
    expect(loadableWithErrorDefaults.error).toBe(loadableError);

    const emptyLoadable: ILoadable<number | null> = createLoadable();

    expect(Object.keys(loadableWithErrorDefaults)).toHaveLength(7);

    expect(emptyLoadable.error).toBeNull();
    expect(emptyLoadable.isLoading).toBeFalsy();
    expect(emptyLoadable.value).toBeNull();
  });

  it("Should properly declare loadable objects flags.", () => {
    const mutable: ILoadable<{ test: boolean }> = createLoadable({
      test: true
    });

    expect(mutable instanceof NestedStore).toBeTruthy();

    const next: ILoadable<{ test: boolean }> = mutable.asUpdated({
      test: false
    });

    expect(next instanceof NestedStore).toBeTruthy();
  });

  it("Should properly compute new loadable values.", () => {
    const originalObject = { value: 500 };
    const mutateAsLoadable = asLoading.bind(originalObject as ILoadable<number>);

    const first = mutateAsLoadable();

    expect(first.isLoading).toBeTruthy();
    expect(first.value).toBe(500);
    expect(first.error).toBeNull();
    expect(Object.keys(first)).toHaveLength(3);

    const second = mutateAsLoadable(100);

    expect(second.isLoading).toBeTruthy();
    expect(second.value).toBe(100);
    expect(second.error).toBeNull();
    expect(Object.keys(second)).toHaveLength(3);
  });

  it("Should properly compute updated values.", () => {
    const originalObject = { value: 700 };
    const mutateAsFailed = asFailed.bind(originalObject as ILoadable<number>);

    const first = mutateAsFailed(new Error("Test."));

    expect(first.isLoading).toBeFalsy();
    expect(first.value).toBe(700);
    expect(first.error).toEqual(new Error("Test."));
    expect(Object.keys(first)).toHaveLength(3);

    const second = mutateAsFailed(new Error("Test 2."), 0);

    expect(second.isLoading).toBeFalsy();
    expect(second.value).toBe(0);
    expect(second.error).toEqual(new Error("Test 2."));
    expect(Object.keys(second)).toHaveLength(3);
  });

  it("Should properly compute ready values.", () => {
    const originalObject = { value: 700, isLoading: true, error: new Error("Test.") };
    const mutateAsReady = asReady.bind(originalObject as ILoadable<number>);

    const first = mutateAsReady();

    expect(first.isLoading).toBeFalsy();
    expect(first.value).toBe(700);
    expect(first.error).toBeNull();
    expect(Object.keys(first)).toHaveLength(3);

    const second = mutateAsReady(55);

    expect(second.isLoading).toBeFalsy();
    expect(second.value).toBe(55);
    expect(second.error).toBeNull();
    expect(Object.keys(second)).toHaveLength(3);
  });

  it("Should properly compute updated values.", () => {
    const valueObject = { value: 1 };
    const mutateAsUpdated = asUpdated.bind(valueObject as ILoadable<number>);

    const first = mutateAsUpdated(5);

    expect(first.value).toBe(5);
    expect(first.isLoading).toBeUndefined();
    expect(first.error).toBeUndefined();
    expect(Object.keys(first)).toHaveLength(3);

    const second = mutateAsUpdated(10, true);

    expect(second.isLoading).toBeTruthy();
    expect(second.value).toBe(10);
    expect(first.error).toBeUndefined();
    expect(Object.keys(second)).toHaveLength(3);

    const third = mutateAsUpdated(25, true, new Error("Test"));

    expect(third.isLoading).toBeTruthy();
    expect(third.error).toBeDefined();
    expect(third.value).toBe(25);
    expect(Object.keys(third)).toHaveLength(3);
  });
});
