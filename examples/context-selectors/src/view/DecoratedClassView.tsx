import { Consume } from "dreamstate";
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
    take: ({ score }) => ({ score })
  },
  {
    from: DataContextManager,
    take: [ "dataActions" ]
  }
)
export class DecoratedClassView extends PureComponent<IDecoratedClassViewInjectedProps> {

  public render(): ReactNode {
    const { dataActions } = this.props;

    return (
      <div className={"example-view"}>

        DecoratedClassView: { getFullCurrentTime() } <br/>

        <div className={"example-section"}>
          <b> Data context: </b> <br/>
          <button onClick={dataActions.randomizeValue}> Randomize Value </button>
        </div>

        <p>
          Props: { JSON.stringify(this.props) }.
        </p>

      </div>
    );
  }

}
