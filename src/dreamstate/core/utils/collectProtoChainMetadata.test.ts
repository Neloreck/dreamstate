import { ContextManager, DreamstateError, OnQuery, OnSignal } from "@/dreamstate";
import { QUERY_METADATA_REGISTRY, SIGNAL_METADATA_REGISTRY } from "@/dreamstate/core/internals";
import { collectProtoChainMetadata } from "@/dreamstate/core/utils/collectProtoChainMetadata";
import { TAnyValue } from "@/dreamstate/types";
import { TestManager } from "@/fixtures";

describe("collectProtoChainMetadata util method", () => {
  class BaseSignalContextManager extends ContextManager {
    @OnSignal("ANOTHER_SIGNAL")
    private onSomeBaseSignal(): void {
      // example impl
    }
  }

  class FirstSignalExtendingContextManager extends BaseSignalContextManager {}

  class SecondSignalExtendingContextManager extends FirstSignalExtendingContextManager {
    @OnSignal("SOME_SIGNAL")
    private onSomeSignal(): void {
      // example impl
    }
  }

  class BaseQueryContextManager extends ContextManager {
    @OnQuery("ANOTHER_QUERY")
    private onSomeBaseSignal(): number {
      return -1;
    }
  }

  class FirstQueryExtendingContextManager extends BaseQueryContextManager {}

  class SecondQueryExtendingContextManager extends FirstQueryExtendingContextManager {
    @OnQuery("SOME_QUERY")
    private onSomeQuery(): number {
      return 0;
    }
  }

  it("should properly follow class chain until base class for signal metadata", () => {
    expect(() => collectProtoChainMetadata(BaseSignalContextManager, SIGNAL_METADATA_REGISTRY)).not.toThrow();
    expect(() => collectProtoChainMetadata(FirstSignalExtendingContextManager, SIGNAL_METADATA_REGISTRY)).not.toThrow();
    expect(() =>
      collectProtoChainMetadata(SecondSignalExtendingContextManager, SIGNAL_METADATA_REGISTRY)).not.toThrow();

    expect(collectProtoChainMetadata(BaseSignalContextManager, SIGNAL_METADATA_REGISTRY)).toHaveLength(1);
    expect(collectProtoChainMetadata(FirstSignalExtendingContextManager, SIGNAL_METADATA_REGISTRY)).toHaveLength(1);
    expect(collectProtoChainMetadata(SecondSignalExtendingContextManager, SIGNAL_METADATA_REGISTRY)).toHaveLength(2);
  });

  it("should properly follow class chain until base class for query metadata", () => {
    expect(() => collectProtoChainMetadata(BaseQueryContextManager, QUERY_METADATA_REGISTRY)).not.toThrow();
    expect(() => collectProtoChainMetadata(FirstQueryExtendingContextManager, QUERY_METADATA_REGISTRY)).not.toThrow();
    expect(() => collectProtoChainMetadata(SecondQueryExtendingContextManager, QUERY_METADATA_REGISTRY)).not.toThrow();

    expect(collectProtoChainMetadata(BaseQueryContextManager, QUERY_METADATA_REGISTRY)).toHaveLength(1);
    expect(collectProtoChainMetadata(FirstQueryExtendingContextManager, QUERY_METADATA_REGISTRY)).toHaveLength(1);
    expect(collectProtoChainMetadata(SecondQueryExtendingContextManager, QUERY_METADATA_REGISTRY)).toHaveLength(2);
  });

  it("should properly handle duplicated metadata", () => {
    class SomeBase extends ContextManager {
      @OnSignal("ON_SOME_SIGNAL")
      protected onSomeSignal(): void {
        // example.
      }
    }

    class SomeExtending extends SomeBase {
      @OnSignal("ON_SOME_SIGNAL")
      protected onSomeSignal(): void {
        // example.
      }
    }

    expect(collectProtoChainMetadata(SomeBase, SIGNAL_METADATA_REGISTRY)).toHaveLength(1);
    // todo: Expect only one for uniqueness here?
    expect(collectProtoChainMetadata(SomeExtending, SIGNAL_METADATA_REGISTRY)).toHaveLength(2);
  });

  it("should throw exception on non ContextManager classes", () => {
    class SomeClass {}

    expect(() => collectProtoChainMetadata(SomeClass as TAnyValue, SIGNAL_METADATA_REGISTRY)).toThrow(DreamstateError);
    expect(() => collectProtoChainMetadata(SomeClass as TAnyValue, SIGNAL_METADATA_REGISTRY)).toThrow(DreamstateError);
    expect(() => collectProtoChainMetadata(ContextManager as TAnyValue, SIGNAL_METADATA_REGISTRY)).toThrow(
      DreamstateError
    );
    expect(() => collectProtoChainMetadata(TestManager, SIGNAL_METADATA_REGISTRY)).not.toThrow(DreamstateError);
  });
});
