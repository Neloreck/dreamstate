import { ContextService, OnSignal } from "@/dreamstate";
import { ESignal } from "@/fixtures/signals/ESignal";

export class SubscribedService extends ContextService {

  @OnSignal(ESignal.NUMBER_SIGNAL)
  public onNumberSignal(): void {
  }

}
