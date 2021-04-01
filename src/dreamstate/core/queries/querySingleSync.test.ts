import { querySingleSync } from "@/dreamstate/core/queries/querySingleSync";
import { registerService } from "@/dreamstate/test-utils/registry/registerService";
import { unRegisterService } from "@/dreamstate/test-utils/registry/unRegisterService";
import { TOptionalQueryResponse } from "@/dreamstate/types";
import { EQuery, RespondingService } from "@/fixtures/queries";

describe("querySingleSync method", () => {
  beforeEach(() => {
    registerService(RespondingService);
  });

  afterEach(() => {
    unRegisterService(RespondingService);
  });

  it("Should properly find async query responders or fallback to null for single queries", async () => {
    const undefinedResponse: TOptionalQueryResponse<215> = querySingleSync({ type: EQuery.UNDEFINED_QUERY });
    const stringResponse: TOptionalQueryResponse<string> = querySingleSync({
      type: EQuery.SYNC_STRING_QUERY,
      data: "string"
    });

    expect(stringResponse).not.toBeNull();
    expect(stringResponse!.data).toBe("string");
    expect(stringResponse!.answerer).toBe(RespondingService);
    expect(typeof stringResponse!.timestamp).toBe("number");

    expect(undefinedResponse).toBeNull();
  });
});
