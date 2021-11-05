import { ContextManager, createActions } from "dreamstate";

/**
 * Declare context data typing.
 */
export interface ISampleContext {
  sampleActions: {
    setSampleString(value: string): void;
    incrementSampleNumber(): void;
  };
  sampleString: string;
  sampleNumber: number;
}

/**
 * Declare manager class that handles declared data.
 */
export class SampleManager extends ContextManager<ISampleContext> {

  /**
   * Initial context data.
   */
  public context: ISampleContext = {
    sampleActions: createActions({
      incrementSampleNumber: () => this.incrementSampleNumber(),
      setSampleString: (value: string) => this.setSampleString(value)
    }),
    sampleNumber: 0,
    sampleString: "default"
  };

  public setSampleString(value: string): void {
    window.console.info(SampleManager.name, "set sample string called", value);
    this.setContext({ sampleString: value });
  }

  public incrementSampleNumber(): void {
    window.console.info(SampleManager.name, "increment sample number called");
    this.setContext(({ sampleNumber }) => {
      return { sampleNumber: sampleNumber + 1 };
    });
  }

  /**
   * Lifecycle event, triggered after provider mount.
   */
  public onProvisionStarted(): void {
    window.console.info("Sample context provision started");
  }

  /**
   * Lifecycle event, triggered after provider unmount.
   */
  public onProvisionEnded(): void {
    window.console.info("Sample context provision ended");
  }

}
