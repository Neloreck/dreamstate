import { onMetadataSignalListenerCalled } from "@/dreamstate/core/scoping/signals/onMetadataSignalListenerCalled";
import { mockManager } from "@/dreamstate/test-utils/services/mockManager";
import { TestManager } from "@/fixtures";

describe("onMetadataSignalListenerCalled method functionality", () => {
  it("should ignore services without metadata and not throw any errors", () => {
    const manager: TestManager = mockManager(TestManager);

    onMetadataSignalListenerCalled.call(manager, {
      type: "TEST",
      timestamp: Date.now(),
      emitter: null,
      data: null,
      cancel: jest.fn()
    });
  });
});
