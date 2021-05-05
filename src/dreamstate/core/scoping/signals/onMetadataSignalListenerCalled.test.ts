import { onMetadataSignalListenerCalled } from "@/dreamstate/core/scoping/signals/onMetadataSignalListenerCalled";
import { TestContextManager } from "@/fixtures";

describe("onMetadataSignalListenerCalled method functionality", () => {
  it("Should ignore services without metadata and not throw any errors", () => {
    onMetadataSignalListenerCalled.call(
      new TestContextManager(),
      {
        type: "TEST",
        timestamp: Date.now(),
        emitter: null,
        data: null,
        cancel: jest.fn()
      }
    );

    expect(true).toBeTruthy();
  });
});
