import { ContextManager, OnSignal } from "@/dreamstate";
import { TAnyObject } from "@/dreamstate/types";
import { ESignal } from "@/fixtures/signals/ESignal";
import { TNumberSignalEvent, TStringSignalEvent } from "@/fixtures/signals/types";

export class SubscribedManager extends ContextManager<TAnyObject> {
  public context: TAnyObject = {};

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
