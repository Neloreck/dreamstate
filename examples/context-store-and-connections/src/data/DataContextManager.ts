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
        value: "value"
    }
  };

  @Bind()
  public randomizeValue(): void {
    // Manual transaction for update.
    this.context.dataState = { ...this.context.dataState, value: "value-" + Math.floor(Math.random() * 100) };
    this.update();
  }

  /*
   * React-like lifecycle.
   */

  @Bind()
  public onProvisionStarted(): void {
    console.info("Provision started of data context started.");
  }

  @Bind()
  public beforeUpdate(): void {
    console.info("Before data context updated triggered.");
  }

}
