import { ContextService } from "@/dreamstate/core/services/ContextService";

export class TestSingleContextService extends ContextService {

  protected static IS_SINGLE: boolean = true;

  public createdAt: number = performance.now();

}
