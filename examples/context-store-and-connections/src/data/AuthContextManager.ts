import { Bind, ReactContextManager } from "dreamstate";

/*
 * Context manager state declaration.
 * You can inject it into your component props type later.
 */

export interface IAuthContext {
  authActions: {
    setUser: (user: string) => void;
    setUserAsync: () => Promise<void>;
    changeAuthenticationStatus: () => void;
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
export class AuthContextManager extends ReactContextManager<IAuthContext> {

  private static ASYNC_USER_CHANGE_DELAY: number = 3000;

  // Default context state.
  protected readonly context: IAuthContext = {
    // Some kind of handlers.
    authActions: {
      changeAuthenticationStatus: this.changeAuthenticationStatus,
      setUserAsync: this.setUserAsync,
      setUser: this.setUser
    },
    // Provided storage.
    authState: {
      isAuthenticated: true,
      user: "anonymous"
    }
  };

  // Setter with autoupdate instead of manual transactional updating.
  private setContext = ReactContextManager.getSetter(this, "authState");

  @Bind()
  public changeAuthenticationStatus(): void {
    this.setContext({ isAuthenticated: !this.context.authState.isAuthenticated });
  }

  @Bind()
  public setUser(user: string): void {
    this.setContext({ user });
  }

  @Bind()
  public setUserAsync(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.setContext({ user: "user-" + Math.floor(Math.random() * 10000) });
        resolve();
      }, AuthContextManager.ASYNC_USER_CHANGE_DELAY)
    });
  }

}
