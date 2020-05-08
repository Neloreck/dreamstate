import { ContextWorker, getCurrent, OnQuery, QueryResponse } from "../";
import { CONTEXT_QUERY_METADATA_REGISTRY } from "../internals";
import { IQueryResponse, TQuerySubscriptionMetadata } from "../types";
import { registerWorker, unRegisterWorker } from "../test-utils";

import { RequestingWorker, RespondingDuplicateWorker, RespondingWorker } from "@Tests/assets/queries";

describe("@OnQuery and queries processing.", () => {
  beforeEach(() => {
    registerWorker(RequestingWorker);
    registerWorker(RespondingWorker);
  });

  afterEach(() => {
    unRegisterWorker(RequestingWorker);
    unRegisterWorker(RespondingWorker);
  });

  it("Should properly find async query responders or fallback to null.", async () => {
    const requestingWorker: RequestingWorker = getCurrent(RequestingWorker)!;

    const numberResponse: QueryResponse<number> = await requestingWorker.sendAsyncNumberQuery();
    const stringResponse: QueryResponse<string> = await requestingWorker.sendAsyncStringQuery("query");
    const booleanResponse: QueryResponse<boolean> = await requestingWorker.sendSyncBooleanQuery();
    const undefinedResponse: QueryResponse<any> = await requestingWorker.sendUndefinedQuery();

    expect(numberResponse).not.toBeNull();
    expect(numberResponse!.data).toBe(100);
    expect(numberResponse!.answerer).toBe(RespondingWorker);

    expect(stringResponse).not.toBeNull();
    expect(stringResponse!.data).toBe("query");
    expect(booleanResponse!.answerer).toBe(RespondingWorker);

    expect(booleanResponse).not.toBeNull();
    expect(booleanResponse!.data).toBe(true);
    expect(booleanResponse!.answerer).toBe(RespondingWorker);

    expect(undefinedResponse).toBeNull();
  });

  it("Should properly handle errors in queries.", () => {
    const requestingWorker: RequestingWorker = getCurrent(RequestingWorker)!;

    expect(requestingWorker.sendAsyncThrowingQuery()).rejects.toBeInstanceOf(Error);
    expect(requestingWorker.sendSyncThrowingQuery()).rejects.toBeInstanceOf(Error);
  });

  it("Should properly handle duplicated query listeners in order of register.", async () => {
    const requestingWorker: RequestingWorker = getCurrent(RequestingWorker)!;

    unRegisterWorker(RespondingWorker);
    unRegisterWorker(RespondingDuplicateWorker);

    registerWorker(RespondingWorker);
    registerWorker(RespondingDuplicateWorker);

    const first: IQueryResponse<number> = (await requestingWorker.sendAsyncNumberQuery())!;

    expect(first.data).toBe(100);

    unRegisterWorker(RespondingWorker);
    unRegisterWorker(RespondingDuplicateWorker);

    registerWorker(RespondingDuplicateWorker);
    registerWorker(RespondingWorker);

    const second: IQueryResponse<number> = (await requestingWorker.sendAsyncNumberQuery())!;

    expect(second.data).toBe(-1);
  });

  it("Should properly save methods metadata for ContextWorkers.", () => {
    const responding: TQuerySubscriptionMetadata = CONTEXT_QUERY_METADATA_REGISTRY.get(RespondingWorker)!;
    const requesting: TQuerySubscriptionMetadata = CONTEXT_QUERY_METADATA_REGISTRY.get(RequestingWorker)!;
    const duplicated: TQuerySubscriptionMetadata = CONTEXT_QUERY_METADATA_REGISTRY.get(RespondingDuplicateWorker)!;

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

  it("Should not work with non-context worker classes and bad queries.", () => {
    expect(() => {
      class Custom {

        @OnQuery("WILL_NOT_WORK")
        private willNotWork(): void {}

      }
    }).toThrow(TypeError);
    expect(() => {
      class Worker extends ContextWorker {

        @OnQuery(undefined as any)
        private willWork(): void {}

      }
    }).toThrow(TypeError);
  });
});
