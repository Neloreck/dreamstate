import { ContextManager, createLoadable, ILoadable } from "../dreamstate";

/*
 * Context manager state declaration.
 * You can inject it into your component props type later.
 */

export interface IAuthContext {
  authActions: {
    randomizeUser(): void;
    randomizeUserAsync(): Promise<void>;
    resetUser(): void;
    randomizeScore(): void;
  };
  user: ILoadable<string>;
  score: number;
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
      randomizeUserAsync: this.randomizeUserAsync.bind(this),
      randomizeUser: this.randomizeUser.bind(this),
      resetUser: this.resetUser.bind(this),
      randomizeScore: this.randomizeScore.bind(this)
    },
    // Loadable utility to manage loading state for async items.
    user: createLoadable("anonymous"),
    score: 0,
  };

  public randomizeScore(): void {
    this.setContext({ score: Math.random() });
  }

  public randomizeUser(): void {
    this.setContext(({ user }) => ({ user: user.asUpdated("r-sync-" + Math.random() * 100) }));
  }

  public resetUser(): void {
    this.setContext(({ user }) => ({ user: user.asInitial() }));
  }

  public async randomizeUserAsync(): Promise<void> {
    this.setContext(({ user }) => ({ user: user.asLoading() }));
    // Just creating delay like async request does.
    await this.waitFor(AuthContextManager.ASYNC_USER_CHANGE_DELAY);
    // Finish update.
    this.setContext(({ user }) => ({ user: user.asReady("r-async-" + Math.random() * 1000) }));
  }

  /**
   * Providing some handlers only for example:
   */

  protected onProvisionStarted(): void {
    console.info("Auth provision started.");
  }

  protected onProvisionEnded(): void {
    console.info("Auth provision ended.");
  }

  protected beforeUpdate(nextContext: IAuthContext): void {
    console.info("Before auth context updated triggered.");
  }

  private waitFor(millis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, millis));
  }

}
