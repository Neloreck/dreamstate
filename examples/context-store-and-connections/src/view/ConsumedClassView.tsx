import React, { Context, PureComponent, ReactNode } from "react";

// Data.
import { AuthContextManager, IAuthContext } from "../data";

// View.
import { getFullCurrentTime } from "./utils/time";

export class ConsumedClassView extends PureComponent<{}, never, IAuthContext> {

  public static contextType: Context<IAuthContext> = AuthContextManager.getContextType();

  public render(): ReactNode {
    const { authActions, user } = this.context;

    return (
      <div className={"example-view"}>

        ConsumedClassView: { getFullCurrentTime() + " [<= even not used props changes will trigger it (score prop)]" }
        <br/>

        <div className={"example-section"}>

          <b> Auth context: </b> <br/>

          Username: { user.isLoading ? "loading..." : user.value } <br/>

          <button disabled={user.isLoading} onClick={authActions.randomizeUser}> Randomize User </button>
          <button disabled={user.isLoading} onClick={authActions.randomizeUserAsync}> Randomize User Async </button>

        </div>

        <p>
          This is simple class component that consumes exactly one context like react doc tells. <br/>
          + Easy to manage, test and write. <br/>
          + You will not mix props and context there => you will never get names collision. <br/>
          + Less reactNodes than with HoC and decorators.
          - It always renders on any context store change without checks. <br/>
          - Only one context can be supplied with 'static contextType'.
        </p>

      </div>
    );
  }

}
