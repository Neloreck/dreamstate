import { querySingle } from "@/dreamstate/core/queries/querySingle";
import { registerService } from "@/dreamstate/test-utils/registry/registerService";
import { unRegisterService } from "@/dreamstate/test-utils/registry/unRegisterService";
import { TOptionalQueryResponse } from "@/dreamstate/types";
import { EQuery, RespondingManager } from "@/fixtures/queries";

describe("querySingle method", () => {
  beforeEach(() => {
    registerService(RespondingManager);
  });

  afterEach(() => {
    unRegisterService(RespondingManager);
  });

  it("Should properly find async query responders or fallback to null for single queries", async () => {
    const numberResponse: TOptionalQueryResponse<number> = await querySingle({ type: EQuery.ASYNC_NUMBER_QUERY });
    const undefinedResponse: TOptionalQueryResponse<215> = await querySingle({ type: EQuery.UNDEFINED_QUERY });

    expect(numberResponse).not.toBeNull();
    expect(numberResponse!.data).toBe(100);
    expect(numberResponse!.answerer).toBe(RespondingManager);
    expect(typeof numberResponse!.timestamp).toBe("number");

    expect(undefinedResponse).toBeNull();
  });
});
