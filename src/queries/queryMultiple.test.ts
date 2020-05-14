import { registerService } from "@Lib/testing/registerService";
import { unRegisterService } from "@Lib/testing/unRegisterService";
import { queryMultiple } from "@Lib/queries/queryMultiple";
import { TQueryResponse } from "@Lib/types";
import { EQuery, RespondingService } from "@Lib/fixtures/queries";

describe("querySingle method.", () => {
  beforeEach(() => {
    registerService(RespondingService);
  });

  afterEach(() => {
    unRegisterService(RespondingService);
  });

  it("Should properly find async query responders or fallback to null for multi queries.", async () => {
    const first: Array<TQueryResponse> = await queryMultiple([]);
    const second: Array<TQueryResponse> = await queryMultiple([ { type: "UNDEFINED_TEST" } ]);
    const third: Array<TQueryResponse> = await queryMultiple([
      { type: EQuery.ASYNC_NUMBER_QUERY },
      { type: "UNDEFINED_TEST" }
    ]);

    expect(first).toHaveLength(0);
    expect(second).toHaveLength(1);
    expect(second[0]).toBeNull();
    expect(third).toHaveLength(2);
    expect(third[0]!.data).toBe(100);
    expect(third[1]).toBeNull();
  });
});
