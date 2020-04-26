import { createElement, useState } from "react";

import { ContextManager, ContextInterceptor } from "@Lib/management";
import { OnSignal, useSignals } from "@Lib/signals";
import { SignalEvent, SignalType } from "@Lib";

export enum ESignal {
  NUMBER_SIGNAL = "NUMBER",
  STRING_SIGNAL = "STRING_SIGNAL",
  EMPTY_SIGNAL = "EMPTY_SIGNAL"
}

export type TStringSignalEvent = SignalEvent<string, ESignal.STRING_SIGNAL>;

export class SubscribedContextManager extends ContextManager<object> {

  public context: object = {};

  @OnSignal(ESignal.NUMBER_SIGNAL)
  public onNumberSignal(signal: SignalEvent<number, SignalType>): void {
    return;
  }

  @OnSignal([ ESignal.STRING_SIGNAL ])
  public onStringSignal(signal: SignalEvent<string, SignalType>): void {
    return;
  }

  @OnSignal([ ESignal.NUMBER_SIGNAL, ESignal.STRING_SIGNAL ])
  public onStringOrNumberSignal(signal: SignalEvent<number | string, SignalType>): void {
    return;
  }

}

export class SubscribedInterceptor extends ContextInterceptor {

  @OnSignal(ESignal.NUMBER_SIGNAL)
  public onNumberSignal(): void {
  }

}

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

export function UsingSignalFunction({ onInternalSignal }: { onInternalSignal: (signal: TStringSignalEvent) => void }) {
  const [ value, setValue ] = useState("initial");

  useSignals((signal: TStringSignalEvent) => {
    if (signal.type === ESignal.STRING_SIGNAL) {
      setValue(signal.data);
      // Emit parent callback for testing.
      onInternalSignal(signal);
    }
  });

  return createElement("div", {}, value);
}
