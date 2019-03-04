import { Bind, ContextManager } from "dreamstate";

/*
 * Context manager state declaration.
 * You can inject it into your component props type later.
 */

export interface IAuthContext {
  authActions: {
    randomizeUser(): void;
    randomizeUserAsync(): Promise<void>;
    changeAuthenticationStatus(): void;
  };
  authState: {
    isAuthenticated: boolean;
    user: string;
  };
}

/*
 * Manager class example, single store for app data.
 * Allows to create consumers/providers components or to use decorators for injection.
 *
 * Also, you can store something inside of it (additional props, static etc...) instead of modifying state each time.
 */
export class AuthContextManager extends ContextManager<IAuthContext> {

  private static ASYNC_USER_CHANGE_DELAY: number = 3000;

  // Default context state.
  protected readonly context: IAuthContext = {
    // Some kind of handlers.
    authActions: {
      changeAuthenticationStatus: this.changeAuthenticationStatus,
      randomizeUserAsync: this.randomizeUserAsync,
      randomizeUser: this.randomizeUser
    },
    // Provided storage.
    authState: {
      isAuthenticated: true,
      user: "anonymous"
    }
  };

  // Setter with autoupdate instead of manual transactional updating.
  private setContext = ContextManager.getSetter(this, "authState");

  @Bind()
  public changeAuthenticationStatus(): void {
    this.setContext({ isAuthenticated: !this.context.authState.isAuthenticated });
  }

  @Bind()
  public randomizeUser(): void {
    this.setContext({ user: "user-" + Math.floor(Math.random() * 100) });
  }

  @Bind()
  public randomizeUserAsync(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.randomizeUser();
        resolve();
      }, AuthContextManager.ASYNC_USER_CHANGE_DELAY)
    });
  }

}
