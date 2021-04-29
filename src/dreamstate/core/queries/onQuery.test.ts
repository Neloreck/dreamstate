import { CONTEXT_QUERY_METADATA_REGISTRY } from "@/dreamstate/core/internals";
import { OnQuery } from "@/dreamstate/core/queries/OnQuery";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { getCurrent } from "@/dreamstate/test-utils/registry/getCurrent";
import { registerService } from "@/dreamstate/test-utils/registry/registerService";
import { unRegisterService } from "@/dreamstate/test-utils/registry/unRegisterService";
import { IQueryResponse, TQueryResponse, TQuerySubscriptionMetadata } from "@/dreamstate/types";
import { RequestingManager, RespondingDuplicateManager, RespondingManager } from "@/fixtures/queries";

describe("@OnQuery and queries processing", () => {
  beforeEach(() => {
    registerService(RequestingManager);
    registerService(RespondingManager);
  });

  afterEach(() => {
    unRegisterService(RequestingManager);
    unRegisterService(RespondingManager);
  });

  it("Should properly find async query responders or fallback to null", async () => {
    const requestingService: RequestingManager = getCurrent(RequestingManager)!;

    const numberResponse: TQueryResponse<number> = await requestingService.queryAsyncNumberData();
    const stringResponse: TQueryResponse<string> = await requestingService.queryAsyncStringData("query");
    const booleanResponse: TQueryResponse<boolean> = await requestingService.querySyncBooleanData();
    const undefinedResponse: TQueryResponse<any> = await requestingService.queryUndefinedData();

    expect(numberResponse).not.toBeNull();
    expect(numberResponse!.data).toBe(100);
    expect(numberResponse!.answerer).toBe(RespondingManager);

    expect(stringResponse).not.toBeNull();
    expect(stringResponse!.data).toBe("query");
    expect(booleanResponse!.answerer).toBe(RespondingManager);

    expect(booleanResponse).not.toBeNull();
    expect(booleanResponse!.data).toBe(true);
    expect(booleanResponse!.answerer).toBe(RespondingManager);

    expect(undefinedResponse).toBeNull();
  });

  it("Should properly handle errors in queries", () => {
    const requestingService: RequestingManager = getCurrent(RequestingManager)!;

    expect(requestingService.queryAsyncThrowingData()).rejects.toBeInstanceOf(Error);
    expect(requestingService.querySyncThrowingData()).rejects.toBeInstanceOf(Error);
  });

  it("Should properly handle duplicated query listeners in order of register", async () => {
    const requestingService: RequestingManager = getCurrent(RequestingManager)!;

    unRegisterService(RespondingManager);
    unRegisterService(RespondingDuplicateManager);

    registerService(RespondingManager);
    registerService(RespondingDuplicateManager);

    const first: IQueryResponse<number> = (await requestingService.queryAsyncNumberData())!;

    expect(first.data).toBe(100);

    unRegisterService(RespondingManager);
    unRegisterService(RespondingDuplicateManager);

    registerService(RespondingDuplicateManager);
    registerService(RespondingManager);

    const second: IQueryResponse<number> = (await requestingService.queryAsyncNumberData())!;

    expect(second.data).toBe(-1);
  });

  it("Should properly save methods metadata for ContextManagers", () => {
    const responding: TQuerySubscriptionMetadata = CONTEXT_QUERY_METADATA_REGISTRY.get(RespondingManager)!;
    const requesting: TQuerySubscriptionMetadata = CONTEXT_QUERY_METADATA_REGISTRY.get(RequestingManager)!;
    const duplicated: TQuerySubscriptionMetadata = CONTEXT_QUERY_METADATA_REGISTRY.get(RespondingDuplicateManager)!;

    expect(responding).toBeDefined();
    expect(duplicated).toBeDefined();
    expect(requesting).toBeUndefined();

    expect(responding).toHaveLength(6);
    expect(duplicated).toHaveLength(1);

    responding.concat(duplicated).forEach(([ method, type ]) => {
      expect(typeof method).toBe("string");
      expect(typeof type).toBe("string");
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
