import { QueryResponse } from "../index";
import { registerWorker, unRegisterWorker } from "../test-utils";
import { querySingle } from "../queries";

import { EQuery, RespondingWorker } from "@Tests/assets/queries";

describe("querySingle method.", () => {
  beforeEach(() => {
    registerWorker(RespondingWorker);
  });

  afterEach(() => {
    unRegisterWorker(RespondingWorker);
  });

  it("Should properly find async query responders or fallback to null for single queries.", async () => {
    const numberResponse: QueryResponse<number> = await querySingle({ type: EQuery.ASYNC_NUMBER_QUERY });
    const undefinedResponse: QueryResponse<215> = await querySingle({ type: EQuery.UNDEFINED_QUERY });

    expect(numberResponse).not.toBeNull();
    expect(numberResponse!.data).toBe(100);
    expect(numberResponse!.answerer).toBe(RespondingWorker);
    expect(typeof numberResponse!.timestamp).toBe("number");

    expect(undefinedResponse).toBeNull();
  });
});
