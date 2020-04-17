import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { withConsumption } from "dreamstate";

// Data.
import { AuthContextManager, IAuthContext } from "../data";

// View.
import { getFullCurrentTime } from "./utils/time";

export interface IHOCClassViewInjectedProps extends IAuthContext {
}

class ClassView extends PureComponent<IHOCClassViewInjectedProps> {

  public render(): ReactNode {
    const { user, authActions } = this.props;

    return (
      <div className={"example-view"}>

        HOCClassView: { getFullCurrentTime() + " [<= even not used props changes will trigger it (score prop)]"  } <br/>

        <div className={"example-section"}>
          <b> Auth context: </b> <br/>
          Username: { user.isLoading ? "loading..." : user.value } <br/>
          <button disabled={user.isLoading} onClick={authActions.randomizeUser}> Randomize User </button>
          <button disabled={user.isLoading} onClick={authActions.randomizeUserAsync}> Randomize User Async </button>
        </div>

        <p>
          This is simple HoC based component that consumes contexts and uses wrapper functions. <br/>
          + Selectors can help optimize rendering and pick needed props. <br/>
          + Harder to write with HoCs. <br/>
          - HoC classes are easier to test. <br/>
          - HoCs create more and more not needed react nodes. <br/>
          - Should manually mix props, manage naming collisions and declare types (like redux). <br/>
        </p>

      </div>
    );
  }

}

// Usable for functions also, but useManager is proper way to handle managers in functional components.
export const HOCClassView = withConsumption(AuthContextManager)(ClassView);
