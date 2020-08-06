import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { ESignal } from "@/fixtures/signals/ESignal";

export class EmittingContextManager extends ContextManager<object> {

  public context: object = {};

  public sendNumberSignal(): void {
    this.emitSignal({ type: ESignal.NUMBER_SIGNAL, data: Math.random() });
  }

  public sendStringSignal(data: string = "random-" + Math.random()): void {
    this.emitSignal({ type: ESignal.STRING_SIGNAL, data });
  }

  public sendEmptySignal(): void {
    this.emitSignal({ type: ESignal.EMPTY_SIGNAL });
  }

}
