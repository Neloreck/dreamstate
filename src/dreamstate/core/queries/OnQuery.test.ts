import { QUERY_METADATA_SYMBOL } from "@/dreamstate/core/internals";
import { OnQuery } from "@/dreamstate/core/queries/OnQuery";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { mockManager } from "@/dreamstate/test-utils/services/mockManager";
import { TQuerySubscriptionMetadata } from "@/dreamstate/types";
import { RespondingManager } from "@/fixtures/queries";

describe("@OnQuery and queries processing", () => {
  it("Should properly save methods metadata for ContextManagers", () => {
    const manager: RespondingManager = mockManager(RespondingManager);
    const metadata: TQuerySubscriptionMetadata = manager[QUERY_METADATA_SYMBOL];

    expect(metadata).toHaveLength(6);

    metadata.forEach((it) => {
      expect(typeof it[0]).toBe("string");
      expect(typeof it[1]).toBe("string");
    });
  });

  it("Should not work with non-context service classes and bad queries", () => {
    const createTestedClass = <T>(queryType: T) => {
      class Manager extends ContextManager {

        @OnQuery(queryType as any)
        private willWork(): void {
        }

      }

      return Manager;
    };

    /**
     * Should extend base class.
     */
    expect(() => {
      class Custom {

        @OnQuery("WILL_NOT_WORK")
        private willNotWork(): void {}

      }
    }).toThrow(TypeError);

    expect(() => createTestedClass(undefined)).toThrow(TypeError);
    expect(() => createTestedClass(null)).toThrow(TypeError);
    expect(() => createTestedClass([])).toThrow(TypeError);
    expect(() => createTestedClass({})).toThrow(TypeError);
    expect(() => createTestedClass(new Map())).toThrow(TypeError);
    expect(() => createTestedClass(new Error())).toThrow(TypeError);
    expect(() => createTestedClass(void 0)).toThrow(TypeError);
  });
});
