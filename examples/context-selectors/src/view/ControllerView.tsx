import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { Consume } from "dreamstate";

// Data.
import { AuthContextManager, DataContextManager, IAuthContext, IDataContext } from "../data";

// View.
import { getFullCurrentTime } from "./utils/time";

export interface IControllerViewInjectedProps extends IDataContext, IAuthContext {
}

@Consume(
  AuthContextManager,
  DataContextManager
)
export class ControllerView extends PureComponent<IControllerViewInjectedProps> {

  public render(): ReactNode {
    const { dataActions, dataState: { value }, authActions, user, score  } = this.props;

    return (
      <div className={"example-view"}>

        ControllerView: { getFullCurrentTime() } <br/>
        Context changer. <br/>

        <div className={"example-section"}>
          <b> Auth context: </b> <br/>
          Username: { user.isLoading ? "loading..." : user.value } <br/>
          Score: { score } <br/>
          <button onClick={authActions.randomizeUser}> Randomize User </button>
          <button onClick={authActions.randomizeUserAsync}> Randomize User Async </button>
          <button onClick={authActions.randomizeScore}> Randomize Score </button>
        </div>

        <div className={"example-section"}>
          <b> Data context: </b> <br/>
          Value: { value } <br/>
          <button onClick={dataActions.randomizeValue}> Randomize Value </button>
        </div>

      </div>
    );
  }

}
