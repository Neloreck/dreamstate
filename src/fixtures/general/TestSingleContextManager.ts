import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { ITestContext } from "@/fixtures/general/TestContextManager";

export class TestSingleContextManager extends ContextManager<ITestContext> {

  protected static IS_SINGLE: boolean = true;

  public readonly context: ITestContext = {
    first: "first",
    second: 2,
    third: false
  };

}
