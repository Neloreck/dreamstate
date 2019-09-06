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
    isLoading: boolean;
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

  private static ASYNC_USER_CHANGE_DELAY: number = 1000;

  // Default context state.
  public readonly context: IAuthContext = {
    // Some kind of handlers.
    authActions: {
      changeAuthenticationStatus: this.changeAuthenticationStatus,
      randomizeUserAsync: this.randomizeUserAsync,
      randomizeUser: this.randomizeUser
    },
    // Provided storage.
    authState: {
      isAuthenticated: true,
      isLoading: false,
      user: "anonymous"
    }
  };

  // Setter with autoupdate instead of manual transactional updating.
  private setState = ContextManager.getSetter(this, "authState");

  @Bind()
  public changeAuthenticationStatus(): void {
    this.setState({ isAuthenticated: !this.context.authState.isAuthenticated });
  }

  @Bind()
  public randomizeUser(): void {
    this.setState({ user: "user-" + Math.floor(Math.random() * 100) });
  }

  @Bind()
  public randomizeUserAsync(): Promise<void> {

    this.setState({ isLoading: true });

    return this.waitFor(AuthContextManager.ASYNC_USER_CHANGE_DELAY)
      .then(() => `randomized-${Math.floor(Math.random() * 100)}`)
      .then((user: string) => this.setState({ isLoading: false, user }));
  }

  private waitFor(millis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), millis));
  }

}
