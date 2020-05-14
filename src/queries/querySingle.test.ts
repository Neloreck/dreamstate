import { registerService } from "@Lib/testing/registerService";
import { unRegisterService } from "@Lib/testing/unRegisterService";
import { querySingle } from "@Lib/queries/querySingle";
import { TQueryResponse } from "@Lib/types";
import { EQuery, RespondingService } from "@Lib/fixtures/queries";

describe("querySingle method.", () => {
  beforeEach(() => {
    registerService(RespondingService);
  });

  afterEach(() => {
    unRegisterService(RespondingService);
  });

  it("Should properly find async query responders or fallback to null for single queries.", async () => {
    const numberResponse: TQueryResponse<number> = await querySingle({ type: EQuery.ASYNC_NUMBER_QUERY });
    const undefinedResponse: TQueryResponse<215> = await querySingle({ type: EQuery.UNDEFINED_QUERY });

    expect(numberResponse).not.toBeNull();
    expect(numberResponse!.data).toBe(100);
    expect(numberResponse!.answerer).toBe(RespondingService);
    expect(typeof numberResponse!.timestamp).toBe("number");

    expect(undefinedResponse).toBeNull();
  });
});
