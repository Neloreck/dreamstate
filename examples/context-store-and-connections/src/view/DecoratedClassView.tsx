import { Consume } from "../dreamstate";
import * as React from "react";
import { PureComponent, ReactNode } from "react";

// Data.
import { AuthContextManager, DataContextManager, IAuthContext, IDataContext } from "../data";

// View.
import { getFullCurrentTime } from "./utils/time";

export interface IDecoratedClassViewInjectedProps extends IDataContext {
  user: IAuthContext["user"];
}

@Consume(
  // Redux-like selection of only needed props.
  {
    from: AuthContextManager,
    take: ({ user }) => user,
    as: "user"
  },
  DataContextManager
)
export class DecoratedClassView extends PureComponent<IDecoratedClassViewInjectedProps> {

  public render(): ReactNode {
    const { dataActions, dataState: { value }, user } = this.props;

    return (
      <div className={"example-view"}>

        DecoratedClassView: { getFullCurrentTime() } <br/>

        <div className={"example-section"}>
          <b> Auth context: </b> <br/>
          Username: { user.isLoading ? "loading..." : user.value } <br/>
        </div>

        <div className={"example-section"}>
          <b> Data context: </b> <br/>
          Value: { value } <br/>
          <button onClick={dataActions.randomizeValue}> Randomize Value </button>
        </div>

        <p>
          This is simple decorated component that consumes contexts and uses decorators with selectors. <br/>
          + Easy to write with decorators. <br/>
          + Selectors can help optimize rendering and pick needed props. <br/>
          - HoCs create more and more not needed react nodes. <br/>
          - Decorated classes are harder to test. <br/>
          - Should manually mix props, manage naming collisions and declare types (like redux). <br/>
        </p>

      </div>
    );
  }

}
