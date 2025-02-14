import { ContextManager, OnQuery } from "@/dreamstate";
import { EQuery } from "@/fixtures/queries/EQuery";
import { TAsyncNumberQuery } from "@/fixtures/queries/types";

export class RespondingDuplicateManager extends ContextManager {
  @OnQuery(EQuery.ASYNC_NUMBER_QUERY)
  public async onAsyncNumberQuery(queryRequest: TAsyncNumberQuery): Promise<number> {
    return -1;
  }
}
