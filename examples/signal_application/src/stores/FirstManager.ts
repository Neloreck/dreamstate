import { ContextManager, createActions, OnSignal } from "dreamstate";

import { EGenericSignal, TSampleNumberChangedSignalEvent, TSampleStringChangedSignalEvent } from "./signals";

/**
 * Declare context data typing.
 */
export interface IFirstContext {
  sampleActions: {
  };
  sampleNumber: number;
  reflectedString: string;
}

/**
 * Declare manager class that handles declared data.
 */
export class FirstManager extends ContextManager<IFirstContext> {

  /**
   * Initial context data.
   */
  public context: IFirstContext = {
    sampleActions: createActions({
    }),
    sampleNumber: 0,
    reflectedString: ""
  };

  /**
   * Subscribe on signal to change current number.
   */
  @OnSignal(EGenericSignal.SAMPLE_NUMBER_CHANGED)
  private onSampleNumberChanged({ type, data }: TSampleNumberChangedSignalEvent): void {
    window.console.info(FirstManager.name, "received signal", type, data);
    this.setContext({ sampleNumber: data });
  }

  /**
   * Subscribe on signal to change current string and reflect external changes in current context.
   */
  @OnSignal(EGenericSignal.SAMPLE_STRING_CHANGED)
  private onSampleStringChanged({ type, data }: TSampleStringChangedSignalEvent): void {
    window.console.info(FirstManager.name, "received signal", type, data);
    this.setContext({ reflectedString: data });
  }

}
