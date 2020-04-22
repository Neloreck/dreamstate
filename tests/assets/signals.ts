import { ContextManager } from "../../src/management";
import { OnSignal } from "../../src/signals";
import { ISignalEvent, TSignalType } from "../../src/types";

export enum ESignal {
  NUMBER_SIGNAL = "NUMBER",
  STRING_SIGNAL = "STRING_SIGNAL",
  EMPTY_SIGNAL = "EMPTY_SIGNAL"
}

export class SubscribedContextManager extends ContextManager<object> {

  public context: object = {};

  @OnSignal(ESignal.NUMBER_SIGNAL)
  public onNumberSignal(signal: ISignalEvent<number, TSignalType>): void {
    return;
  }

  @OnSignal([ ESignal.STRING_SIGNAL ])
  public onStringSignal(signal: ISignalEvent<string, TSignalType>): void {
    return;
  }

  @OnSignal([ ESignal.NUMBER_SIGNAL, ESignal.STRING_SIGNAL ])
  public onStringOrNumberSignal(signal: ISignalEvent<number | string, TSignalType>): void {
    return;
  }

}

export class EmittingContextManager extends ContextManager<object> {

  public context: object = {};

  public sendNumberSignal(): void {
    this.emitSignal({ type: ESignal.NUMBER_SIGNAL, data: Math.random() });
  }

  public sendStringSignal(): void {
    this.emitSignal({ type: ESignal.STRING_SIGNAL, data: "random-" + Math.random() });
  }

  public sendEmptySignal(): void {
    this.emitSignal({ type: ESignal.EMPTY_SIGNAL });
  }

}
