import { CONTEXT_QUERY_METADATA_REGISTRY } from "@/dreamstate/core/internals";
import { OnQuery } from "@/dreamstate/core/queries/OnQuery";
import { getCurrent } from "@/dreamstate/core/registry/getCurrent";
import { ContextService } from "@/dreamstate/core/services/ContextService";
import { registerService } from "@/dreamstate/test-utils/registry/registerService";
import { unRegisterService } from "@/dreamstate/test-utils/registry/unRegisterService";
import { IQueryResponse, TQueryResponse, TQuerySubscriptionMetadata } from "@/dreamstate/types";
import { RequestingService, RespondingDuplicateService, RespondingService } from "@/fixtures/queries";

describe("@OnQuery and queries processing", () => {
  beforeEach(() => {
    registerService(RequestingService);
    registerService(RespondingService);
  });

  afterEach(() => {
    unRegisterService(RequestingService);
    unRegisterService(RespondingService);
  });

  it("Should properly find async query responders or fallback to null", async () => {
    const requestingService: RequestingService = getCurrent(RequestingService)!;

    const numberResponse: TQueryResponse<number> = await requestingService.queryAsyncNumberData();
    const stringResponse: TQueryResponse<string> = await requestingService.queryAsyncStringData("query");
    const booleanResponse: TQueryResponse<boolean> = await requestingService.querySyncBooleanData();
    const undefinedResponse: TQueryResponse<any> = await requestingService.queryUndefinedData();

    expect(numberResponse).not.toBeNull();
    expect(numberResponse!.data).toBe(100);
    expect(numberResponse!.answerer).toBe(RespondingService);

    expect(stringResponse).not.toBeNull();
    expect(stringResponse!.data).toBe("query");
    expect(booleanResponse!.answerer).toBe(RespondingService);

    expect(booleanResponse).not.toBeNull();
    expect(booleanResponse!.data).toBe(true);
    expect(booleanResponse!.answerer).toBe(RespondingService);

    expect(undefinedResponse).toBeNull();
  });

  it("Should properly handle errors in queries", () => {
    const requestingService: RequestingService = getCurrent(RequestingService)!;

    expect(requestingService.queryAsyncThrowingData()).rejects.toBeInstanceOf(Error);
    expect(requestingService.querySyncThrowingData()).rejects.toBeInstanceOf(Error);
  });

  it("Should properly handle duplicated query listeners in order of register", async () => {
    const requestingService: RequestingService = getCurrent(RequestingService)!;

    unRegisterService(RespondingService);
    unRegisterService(RespondingDuplicateService);

    registerService(RespondingService);
    registerService(RespondingDuplicateService);

    const first: IQueryResponse<number> = (await requestingService.queryAsyncNumberData())!;

    expect(first.data).toBe(100);

    unRegisterService(RespondingService);
    unRegisterService(RespondingDuplicateService);

    registerService(RespondingDuplicateService);
    registerService(RespondingService);

    const second: IQueryResponse<number> = (await requestingService.queryAsyncNumberData())!;

    expect(second.data).toBe(-1);
  });

  it("Should properly save methods metadata for ContextServices", () => {
    const responding: TQuerySubscriptionMetadata = CONTEXT_QUERY_METADATA_REGISTRY.get(RespondingService)!;
    const requesting: TQuerySubscriptionMetadata = CONTEXT_QUERY_METADATA_REGISTRY.get(RequestingService)!;
    const duplicated: TQuerySubscriptionMetadata = CONTEXT_QUERY_METADATA_REGISTRY.get(RespondingDuplicateService)!;

    expect(responding).toBeDefined();
    expect(duplicated).toBeDefined();
    expect(requesting).toBeUndefined();

    expect(responding).toHaveLength(5);
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
      class Service extends ContextService {

        @OnQuery(undefined as any)
        private willWork(): void {}

      }
    }).toThrow(TypeError);
  });
});