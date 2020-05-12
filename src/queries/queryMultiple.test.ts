import { registerService, unRegisterService } from "../test-utils";
import { queryMultiple } from "../queries";
import { TQueryResponse } from "../types";

import { EQuery, RespondingService } from "@Tests/assets/queries";

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