import { DreamstateError } from "@/dreamstate/core/error/DreamstateError";
import { LoadableStore } from "@/dreamstate/core/storing/LoadableStore";
import { ILoadable } from "@/dreamstate/types";
import { createLoadable } from "@/dreamstate/utils/createLoadable";

describe("Loadable util", () => {
  it("should properly create loadable objects", () => {
    const loadableValue: number = 10;
    const loadableError: Error = new Error("testError");
    const loadable: ILoadable<number> = createLoadable(loadableValue);

    expect(Object.keys(loadable)).toHaveLength(3);

    expect(loadable.error).toBeNull();
    expect(loadable.isLoading).toBeFalsy();
    expect(loadable.value).toBe(loadableValue);

    expect(typeof loadable.asFailed).toBe("function");
    expect(typeof loadable.asLoading).toBe("function");
    expect(typeof loadable.asReady).toBe("function");
    expect(typeof loadable.asUpdated).toBe("function");

    const loadableWithOtherDefaults: ILoadable<number> = createLoadable(loadableValue, true);

    expect(Object.keys(loadableWithOtherDefaults)).toHaveLength(3);

    expect(loadableWithOtherDefaults.error).toBeNull();
    expect(loadableWithOtherDefaults.isLoading).toBeTruthy();
    expect(loadableWithOtherDefaults.value).toBe(loadableValue);

    const loadableWithErrorDefaults: ILoadable<number> = createLoadable(loadableValue, true, loadableError);

    expect(Object.keys(loadableWithErrorDefaults)).toHaveLength(3);

    expect(loadableWithErrorDefaults.isLoading).toBeTruthy();
    expect(loadableWithErrorDefaults.value).toBe(loadableValue);
    expect(loadableWithErrorDefaults.error).toBeInstanceOf(Error);
    expect(loadableWithErrorDefaults.error).toBe(loadableError);

    const emptyLoadable: ILoadable<number | null> = createLoadable();

    expect(Object.keys(loadableWithErrorDefaults)).toHaveLength(3);

    expect(emptyLoadable.error).toBeNull();
    expect(emptyLoadable.isLoading).toBeFalsy();
    expect(emptyLoadable.value).toBeNull();
  });

  it("should properly declare loadable objects flags", () => {
    const loadable: ILoadable<{ test: boolean }> = createLoadable({
      test: true
    });

    expect(loadable instanceof LoadableStore).toBeTruthy();

    const next: ILoadable<{ test: boolean }> = loadable.asUpdated({
      test: false
    });

    expect(next instanceof LoadableStore).toBeTruthy();
  });

  it("should properly compute new loadable values", () => {
    const originalObject = createLoadable(500);

    const first = originalObject.asLoading();

    expect(first.isLoading).toBeTruthy();
    expect(first.value).toBe(500);
    expect(first.error).toBeNull();
    expect(Object.keys(first)).toHaveLength(3);

    const second = originalObject.asLoading(100);

    expect(second.isLoading).toBeTruthy();
    expect(second.value).toBe(100);
    expect(second.error).toBeNull();
    expect(Object.keys(second)).toHaveLength(3);
  });

  it("should properly compute updated values", () => {
    const originalObject = createLoadable(700);

    const first = originalObject.asFailed(new Error("Test."));

    expect(first.isLoading).toBeFalsy();
    expect(first.value).toBe(700);
    expect(first.error).toEqual(new Error("Test."));
    expect(Object.keys(first)).toHaveLength(3);

    const second = originalObject.asFailed(new Error("Test 2."), 0);

    expect(second.isLoading).toBeFalsy();
    expect(second.value).toBe(0);
    expect(second.error).toEqual(new Error("Test 2."));
    expect(Object.keys(second)).toHaveLength(3);
  });

  it("should properly compute ready values", () => {
    const originalObject = createLoadable(700, true, new Error("Test."));

    const first = originalObject.asReady();

    expect(first.isLoading).toBeFalsy();
    expect(first.value).toBe(700);
    expect(first.error).toBeNull();
    expect(Object.keys(first)).toHaveLength(3);

    const second = originalObject.asReady(55);

    expect(second.isLoading).toBeFalsy();
    expect(second.value).toBe(55);
    expect(second.error).toBeNull();
    expect(Object.keys(second)).toHaveLength(3);
  });

  it("should properly compute updated values", () => {
    const valueObject = createLoadable(1);

    const first = valueObject.asUpdated(5);

    expect(first.value).toBe(5);
    expect(first.isLoading).toBeFalsy();
    expect(first.error).toBeNull();
    expect(Object.keys(first)).toHaveLength(3);

    const second = valueObject.asUpdated(10, true);

    expect(second.isLoading).toBeTruthy();
    expect(second.value).toBe(10);
    expect(first.error).toBeNull();
    expect(Object.keys(second)).toHaveLength(3);

    const third = valueObject.asUpdated(25, true, new DreamstateError());

    expect(third.isLoading).toBeTruthy();
    expect(third.error).toBeInstanceOf(DreamstateError);
    expect(third.value).toBe(25);
    expect(Object.keys(third)).toHaveLength(3);
  });
});
