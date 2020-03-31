import { Bind, ContextManager, createLoadable, ILoadable, TStateSetter } from "../dreamstate";

/*
 * Context manager state declaration.
 * You can inject it into your component props type later.
 */

export interface IAuthContext {
  authActions: {
    randomizeUser(): void;
    randomizeUserAsync(): Promise<void>;
    resetUser(): void;
  };
  authState: {
    user: ILoadable<string>;
  };
}

/*
 * Manager class example, single store for app data.
 * Allows to create consumers/providers components or to use decorators for injection.
 *
 * Also, you can store something inside of it (additional props, static etc...) instead of modifying state each time.
 */
export class AuthContextManager extends ContextManager<IAuthContext> {

  /**
   * Should dreamstate destroy store instance after observers removal or preserve it even if no observers are present.
   * Singleton objects will never be destroyed once created.
   * Non-singleton objects are destroyed if all observers are removed.
   *
   * Sometimes you will want to create stores that are not globally supplied but should have single application state.
   */
  protected static readonly IS_SINGLETON: boolean = true;

  private static readonly ASYNC_USER_CHANGE_DELAY: number = 1000;

  // Default context state.
  public readonly context: IAuthContext = {
    // Some kind of handlers.
    authActions: {
      randomizeUserAsync: this.randomizeUserAsync,
      randomizeUser: this.randomizeUser,
      resetUser: this.resetUser
    },
    // Provided storage.
    authState: {
      user: createLoadable("anonymous")
    }
  };

  // Setter with autoupdate instead of manual transactional updating.
  private setState: TStateSetter<IAuthContext, "authState"> = ContextManager.getSetter(this, "authState");

  @Bind()
  public randomizeUser(): void {

    const { user } = this.context.authState;

    const newUsername: string = "randomized-sync-" + Math.floor(Math.random() * 100);

    this.setState({ user: user.asUpdated(newUsername) });
  }

  @Bind()
  public async randomizeUserAsync(): Promise<void> {

    const { user } = this.context.authState;

    this.setState({ user: user.asLoading() });

    await this.waitFor(AuthContextManager.ASYNC_USER_CHANGE_DELAY);

    const newUsername: string = "randomized-async-" + Math.floor(Math.random() * 1000);

    this.setState({ user: user.asReady(newUsername) });
  }

  @Bind()
  public resetUser(): void {

    const { user } = this.context.authState;

    this.setState({ user: user.asInitial() });
  }

  protected onProvisionStarted(): void {
    console.info("Auth provision started.");
  }

  protected onProvisionEnded(): void {
    console.info("Auth provision ended.");
  }

  protected beforeDestroy(): void {
    // WILL NEVER BE CALLED -> AuthContextManager is singleton because it has static prop IS_SINGLETON = true.
  }

  private waitFor(millis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, millis));
  }

}
