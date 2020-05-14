import { cancelSignal } from "@Lib/core/signals/cancelSignal";

describe("cancelSignal method.", () => {
  it("Should properly set cancel variable.", () => {
    const obj = {};

    expect((obj as any).canceled).toBeFalsy();

    cancelSignal.call(obj as any);

    expect((obj as any).canceled).toBeTruthy();
  });
});
