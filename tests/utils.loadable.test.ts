import { ILoadable } from "../src/types";
import { createLoadable } from "../src/utils";
import { NESTED_STORE_KEY } from "../src/internals";

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

    expect(loadableWithErrorDefaults.error).toBeInstanceOf(Error);
    expect(loadableWithErrorDefaults.isLoading).toBeTruthy();
    expect(loadableWithErrorDefaults.value).toBe(loadableValue);
    expect(loadableWithErrorDefaults.error).toBe(loadableError);
  });

  it("Should properly return ready values.", () => {
    const loadableValue: string = "test";
    const loadable: ILoadable<string> = createLoadable(loadableValue);

    const ready: ILoadable<string> = loadable.asReady("another");

    expect(ready).not.toBe(loadable);
    expect(ready.value).toBe("another");
    expect(ready.isLoading).toBeFalsy();
    expect(ready.error).toBeNull();
  });

  it("Should properly return loading values and update them.", () => {
    const loadableValue: string = "test";
    const loadable: ILoadable<string> = createLoadable(loadableValue);

    const loading: ILoadable<string> = loadable.asLoading();

    expect(loading).not.toBe(loadable);
    expect(loading.value).toBe(loadableValue);
    expect(loading.isLoading).toBeTruthy();
    expect(loading.error).toBeNull();

    const loadingReset: ILoadable<string> = loadable.asLoading("loading");

    expect(loadingReset.value).toBe("loading");

    const updated: ILoadable<string> = loadingReset.asUpdated("updated");

    expect(updated.value).toBe("updated");
    expect(updated.isLoading).toBeTruthy();
  });

  it("Should respect undefined args for loading and failed values", () => {
    const loadableValue: boolean = true;
    const loadable: ILoadable<boolean | undefined> = createLoadable(loadableValue);

    const loadingUndefined: ILoadable<boolean | undefined> = loadable.asLoading(undefined);

    expect(loadingUndefined.value).toBeUndefined();

    const failedUndefined: ILoadable<boolean | undefined> = loadable.asFailed(new Error(), undefined);

    expect(failedUndefined.value).toBeUndefined();
  });

  it("Should properly set loading values as ready.", () => {
    const loadableValue: string = "test";
    const loadable: ILoadable<string> = createLoadable(loadableValue);

    const loading: ILoadable<string> = loadable.asLoading();
    const ready: ILoadable<string> = loading.asReady("ready");

    expect(ready).not.toBe(loadable);
    expect(ready.value).toBe("ready");
    expect(ready.isLoading).toBeFalsy();
    expect(ready.error).toBeNull();
  });

  it("Should properly set loading values as failed and back.", () => {
    const loadableValue: string = "test";
    const loadable: ILoadable<string> = createLoadable(loadableValue);

    const loading: ILoadable<string> = loadable.asLoading();
    const failed: ILoadable<string> = loading.asFailed(new TypeError(), "failed");

    expect(failed).not.toBe(loadable);
    expect(failed.value).toBe("failed");
    expect(failed.isLoading).toBeFalsy();
    expect(failed.error).toBeInstanceOf(TypeError);

    const updated: ILoadable<string> = failed.asUpdated("updated");

    expect(updated.value).toBe("updated");
    expect(updated.error).toBe(failed.error);
    expect(updated.isLoading).toBe(failed.isLoading);

    const ready: ILoadable<string> = updated.asReady("any");

    expect(ready.error).toBeNull();
  });

  it("Should properly declare loadable objects flags.", () => {
    const mutable: ILoadable<{ test: boolean }> = createLoadable({
      test: true
    });

    expect(mutable[NESTED_STORE_KEY]).toBeTruthy();

    const next: ILoadable<{ test: boolean }> = mutable.asUpdated({
      test: false
    });

    expect(next[NESTED_STORE_KEY]).toBeTruthy();
  });
});
