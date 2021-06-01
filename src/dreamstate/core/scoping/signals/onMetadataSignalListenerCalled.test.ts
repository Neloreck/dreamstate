import { onMetadataSignalListenerCalled } from "@/dreamstate/core/scoping/signals/onMetadataSignalListenerCalled";
import { mockManagerWithScope } from "@/dreamstate/test-utils/registry/mockManagerWithScope";
import { TestContextManager } from "@/fixtures";

describe("onMetadataSignalListenerCalled method functionality", () => {
  it("Should ignore services without metadata and not throw any errors", () => {
    const [ manager, scope ] = mockManagerWithScope(TestContextManager);

    onMetadataSignalListenerCalled.call(
      manager,
      {
        type: "TEST",
        timestamp: Date.now(),
        emitter: null,
        data: null,
        cancel: jest.fn()
      }
    );
  });
});
