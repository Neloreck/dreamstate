import { ContextManager, createActions, OnQuery } from "dreamstate";

import { EGenericQuery } from "./queries";

/**
 * Declare context data typing.
 */
export interface ISecondContext {
  secondActions: {
    setSampleNumber(value: number): void;
  };
  sampleNumber: number;
}

/**
 * Declare manager class that handles declared data.
 */
export class SecondManager extends ContextManager<ISecondContext> {
  /**
   * Initial context data.
   */
  public context: ISecondContext = {
    secondActions: createActions({
      setSampleNumber: (value: number) => this.setSampleNumber(value),
    }),
    sampleNumber: 0,
  };

  public onProvisionStarted(): void {
    window.console.info(SecondManager.name, "provision started");
  }

  public onProvisionEnded(): void {
    window.console.info(SecondManager.name, "provision ended");
  }

  /**
   * Simple setter for example number.
   */
  public setSampleNumber(value: number): void {
    window.console.info(SecondManager.name, "set sample number called", value);
    this.setContext({ sampleNumber: value });
  }

  /**
   * Getter that responds all queries with 'SAMPLE_NUMBER' type.
   * Returning value as it is without wrapping and additional steps.
   */
  @OnQuery(EGenericQuery.SAMPLE_NUMBER)
  private onGetSampleNumber(): number {
    window.console.info(SecondManager.name, "get sample number called", this.context.sampleNumber);

    return this.context.sampleNumber;
  }
}
