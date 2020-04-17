import { Bind, ContextManager } from "dreamstate";

/*
 * Context manager state declaration.
 * You can inject it into your component props type later.
 */

export interface IDataContext {
  dataActions: {
    randomizeValue(): void;
  };
  dataState: {
    value: string;
  };
}

/*
 * Manager class example, single store for app data.
 * Allows to create consumers/providers components or to use decorators for injection.
 *
 * Also, you can store something inside of it (additional props, static etc...) instead of modifying state each time.
 */
export class DataContextManager extends ContextManager<IDataContext> {

  // Default context state.
  public readonly context: IDataContext = {
    // Some kind of handlers.
    dataActions: {
      randomizeValue: this.randomizeValue
    },
    // Provided storage.
    dataState: {
      value: "default"
    }
  };

  @Bind()
  public randomizeValue(): void {
    this.setContext({ dataState: { value: "value-" + Math.floor(Math.random() * 100) } });
  }

  /*
   * React-like lifecycle.
   */

  protected onProvisionStarted(): void {
    console.info("Data provision started.");
  }

  protected onProvisionEnded(): void {
    console.info("Data provision ended.");
  }

  protected beforeUpdate(): void {
    console.info("Before data context updated triggered.");
  }

  protected beforeDestroy(): void {
    console.info("Before data context destroyed triggered.");
  }

}
