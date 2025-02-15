import { ContextManager, createActions } from "dreamstate";

import { EGenericQuery, TSampleNumberQueryResponse } from "./queries";

/**
 * Declare context data typing.
 */
export interface IFirstContext {
  firstActions: {
    updateMultipliedNumberValue(): void;
  };
  multipliedNumber: number;
}

/**
 * Declare manager class that handles declared data.
 */
export class FirstManager extends ContextManager<IFirstContext> {
  /**
   * Initial context data.
   */
  public context: IFirstContext = {
    firstActions: createActions({
      updateMultipliedNumberValue: () => this.updateMultipliedNumberValue(),
    }),
    multipliedNumber: 0,
  };

  public onProvisionStarted(): void {
    window.console.info(FirstManager.name, "provision started");
  }

  public onProvisionEnded(): void {
    window.console.info(FirstManager.name, "provision ended");
  }

  public updateMultipliedNumberValue(): void {
    window.console.info(FirstManager.name, "update multiplied number called");

    const {
      type,
      data: sampleNumber,
      ...rest
    }: TSampleNumberQueryResponse = this.queryDataSync({
      type: EGenericQuery.SAMPLE_NUMBER,
    });

    window.console.info(FirstManager.name, "got query response:", type, sampleNumber, rest);
    this.setContext({ multipliedNumber: sampleNumber * 2 });
  }
}
