import { ContextManager, createActions } from "dreamstate";

/**
 * Declare context data typing.
 */
export interface ISampleContext {
  sampleActions: {
    setSampleString(value: string): void;
    incrementSampleNumber(): void;
  }
  sampleString: string;
  sampleNumber: number;
}

/**
 * Declare manager class that handles declared data.
 */
export class SampleContextManager extends ContextManager<ISampleContext> {

  /**
   * Initial context data.
   */
  public context: ISampleContext = {
    sampleActions: createActions({
      incrementSampleNumber: () => this.incrementSampleNumber(),
      setSampleString: (value: string) => this.setSampleString(value),
    }),
    sampleNumber: 0,
    sampleString: "default"
  };

  public setSampleString(value: string): void {
    this.setContext({ sampleString: value });
  }

  public incrementSampleNumber(): void {
    this.setContext(({ sampleNumber }) => {
      return { sampleNumber: sampleNumber + 1 };
    });
  }

  /**
   * Lifecycle event, triggered after provider mount.
   */
  protected onProvisionStarted(): void {
    console.info("Sample context provision started");
  }

  /**
   * Lifecycle event, triggered after provider unmount.
   */
  protected onProvisionEnded(): void {
    console.info("Sample context provision ended");
  }

}
