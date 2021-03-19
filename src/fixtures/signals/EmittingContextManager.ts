import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { TAnyObject } from "@/dreamstate/types";
import { ESignal } from "@/fixtures/signals/ESignal";

export class EmittingContextManager extends ContextManager<TAnyObject> {

  public context: TAnyObject = {};

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
