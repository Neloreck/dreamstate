import { ILoadable } from "../lib/types";
import { createLoadable } from "../lib/utils";

describe("Loadable util.", () => {
  it("Should properly create loadable objects.", () => {
    const loadableValue: number = 10;
    const loadable: ILoadable<number> = createLoadable(loadableValue);

    expect(Object.keys(loadable)).toHaveLength(8);

    expect(loadable.error).toBeNull();
    expect(loadable.isLoading).toBeFalsy();
    expect(loadable.value).toBe(loadableValue);

    expect(typeof loadable.asInitial).toBe("function");
    expect(typeof loadable.asFailed).toBe("function");
    expect(typeof loadable.asLoading).toBe("function");
    expect(typeof loadable.asReady).toBe("function");
    expect(typeof loadable.asUpdated).toBe("function");
  });

  it("Should properly shallow clone objects and return asInitial.", () => {
    const loadableValue: string = "test";
    const loadable: ILoadable<string> = createLoadable(loadableValue);

    const initial: ILoadable<string> = loadable.asInitial();

    expect(initial).not.toBe(loadable);

    for (const it in initial) {
      // @ts-ignore index.
      expect(initial[it]).toBe(loadable[it]);
    }
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
});
