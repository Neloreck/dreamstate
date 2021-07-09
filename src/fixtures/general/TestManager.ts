import { ContextManager } from "@/dreamstate/core/services/ContextManager";

export interface ITestContext {
  first: string;
  second: number;
  third: boolean;
}

export class TestManager extends ContextManager<ITestContext> {

  public readonly context: ITestContext = {
    first: "first",
    second: 2,
    third: false
  };

}
