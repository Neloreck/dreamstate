import { ContextManager, createActions, OnSignal } from "dreamstate";

import { EGenericSignal, TSampleNumberChangedSignalEvent } from "./signals";

/**
 * Declare context data typing.
 */
export interface ISecondContext {
  sampleActions: {
    setSampleString(value: string): void;
  };
  sampleNumber: number;
  sampleString: string;
}

/**
 * Declare manager class that handles declared data.
 */
export class SecondManager extends ContextManager<ISecondContext> {
  /**
   * Initial context data.
   */
  public context: ISecondContext = {
    sampleActions: createActions({
      setSampleString: (value: string) => this.setSampleString(value),
    }),
    sampleNumber: 0,
    sampleString: "sample",
  };

  public setSampleString(value: string): void {
    window.console.info(SecondManager.name, "set sample string called", value);
    this.setContext({ sampleString: value });

    /**
     * Emit signal that string was changed to notify all listeners who subscribe to this signal.
     */
    this.emitSignal({ type: EGenericSignal.SAMPLE_STRING_CHANGED, data: value });
  }

  /**
   * Subscribe on signal to change current number.
   */
  @OnSignal(EGenericSignal.SAMPLE_NUMBER_CHANGED)
  private onSampleNumberChanged({ type, data }: TSampleNumberChangedSignalEvent): void {
    window.console.info(SecondManager.name, "received signal", type, data);
    this.setContext({ sampleNumber: data });
  }
}
