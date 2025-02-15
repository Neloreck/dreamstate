import { DreamstateError } from "@/dreamstate";
import { QUERY_METADATA_SYMBOL } from "@/dreamstate/core/internals";
import { OnQuery } from "@/dreamstate/core/queries/OnQuery";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { mockManager } from "@/dreamstate/test-utils/services/mockManager";
import { EDreamstateErrorCode, TQuerySubscriptionMetadata } from "@/dreamstate/types";
import { getCallableError } from "@/fixtures";
import { RespondingManager } from "@/fixtures/queries";

describe("@OnQuery and queries processing", () => {
  it("should properly save methods metadata for ContextManagers", () => {
    const manager: RespondingManager = mockManager(RespondingManager);
    const metadata: TQuerySubscriptionMetadata = manager[QUERY_METADATA_SYMBOL];

    expect(metadata).toHaveLength(6);

    metadata.forEach((it) => {
      expect(typeof it[0]).toBe("string");
      expect(typeof it[1]).toBe("string");
    });
  });

  it("should not work with non-context service classes and bad queries", () => {
    const createTestedClass = <T>(queryType: T) => {
      class Manager extends ContextManager {
        @OnQuery(queryType as any)
        private willWork(): void {}
      }

      return Manager;
    };

    /**
     * Should extend base class.
     */
    expect(
      getCallableError<DreamstateError>(() => {
        class Custom {
          @OnQuery("WILL_NOT_WORK")
          private willNotWork(): void {}
        }
      }).code
    ).toBe(EDreamstateErrorCode.TARGET_CONTEXT_MANAGER_EXPECTED);

    expect(() => createTestedClass(undefined)).toThrow(DreamstateError);
    expect(() => createTestedClass(null)).toThrow(DreamstateError);
    expect(() => createTestedClass([])).toThrow(DreamstateError);
    expect(() => createTestedClass({})).toThrow(DreamstateError);
    expect(() => createTestedClass(new Map())).toThrow(DreamstateError);
    expect(() => createTestedClass(new Error())).toThrow(DreamstateError);
    expect(() => createTestedClass(void 0)).toThrow(DreamstateError);
    expect(getCallableError<DreamstateError>(() => createTestedClass(void 0)).code).toBe(
      EDreamstateErrorCode.INCORRECT_QUERY_TYPE
    );
  });
});
