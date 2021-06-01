import { QUERY_METADATA_SYMBOL } from "@/dreamstate/core/internals";
import { OnQuery } from "@/dreamstate/core/queries/OnQuery";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { mockManagerWithScope } from "@/dreamstate/test-utils/registry/mockManagerWithScope";
import { TQuerySubscriptionMetadata } from "@/dreamstate/types";
import { RespondingManager } from "@/fixtures/queries";

describe("@OnQuery and queries processing", () => {
  it("Should properly save methods metadata for ContextManagers", () => {
    const [ manager ] = mockManagerWithScope(RespondingManager);
    const metadata: TQuerySubscriptionMetadata = manager[QUERY_METADATA_SYMBOL];

    expect(metadata).toHaveLength(6);

    metadata.forEach((it) => {
      expect(typeof it[0]).toBe("string");
      expect(typeof it[1]).toBe("string");
    });
  });

  it("Should not work with non-context service classes and bad queries", () => {
    expect(() => {
      class Custom {

        @OnQuery("WILL_NOT_WORK")
        private willNotWork(): void {}

      }
    }).toThrow(TypeError);
    expect(() => {
      class Service extends ContextManager {

        @OnQuery(undefined as any)
        private willWork(): void {}

      }
    }).toThrow(TypeError);
  });
});
