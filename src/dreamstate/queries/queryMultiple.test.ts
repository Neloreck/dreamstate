import { queryMultiple } from "@/dreamstate/queries/queryMultiple";
import { registerService } from "@/dreamstate/test-utils/registry/registerService";
import { unRegisterService } from "@/dreamstate/test-utils/registry/unRegisterService";
import { TQueryResponse } from "@/dreamstate/types";
import { EQuery, RespondingService } from "@/fixtures/queries";

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
