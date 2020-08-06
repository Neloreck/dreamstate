import { ContextManager, OnSignal } from "@/dreamstate";
import { ESignal } from "@/fixtures/signals/ESignal";
import { TNumberSignalEvent, TStringSignalEvent } from "@/fixtures/signals/types";

export class SubscribedContextManager extends ContextManager<object> {

  public context: object = {};

  @OnSignal(ESignal.NUMBER_SIGNAL)
  public onNumberSignal(signal: TNumberSignalEvent): void {
    return;
  }

  @OnSignal([ ESignal.STRING_SIGNAL ])
  public onStringSignal(signal: TStringSignalEvent): void {
    return;
  }

  @OnSignal([ ESignal.NUMBER_SIGNAL, ESignal.STRING_SIGNAL ])
  public onStringOrNumberSignal(signal: TStringSignalEvent | TNumberSignalEvent): void {
    return;
  }

}
