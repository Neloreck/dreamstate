import { Consume } from "../dreamstate";
import * as React from "react";
import { PureComponent, ReactNode } from "react";

// Data.
import { AuthContextManager, DataContextManager, IAuthContext, IDataContext } from "../data";

// Props typing: own, injected and bundled props. You should know what has to be declared manually.
export interface IDecoratedClassViewOwnProps {
  someLabelFromExternalProps: string;
}

export interface IDecoratedClassViewInjectedProps extends IAuthContext, Pick<IDataContext, "dataState"> {
}

@Consume(AuthContextManager, { from: DataContextManager, take: [ "dataState" ] })
export class DecoratedClassView extends PureComponent<IDecoratedClassViewInjectedProps & IDecoratedClassViewOwnProps> {

  private static SOME_STATIC_INTERNAL: Date = new Date();

  public render(): ReactNode {

    const {
      // Own prop.
      someLabelFromExternalProps,
      // Get, what you need form injected props.
      dataState: { value },
      authState: { user },
      authActions
    } = this.props;

    return (
      <>

        <div className={"decorated-class-view"}>

          DecoratedClassView <br/>
          <br/>
          Static prop: { DecoratedClassView.SOME_STATIC_INTERNAL.toString() } <br/>
          <br/>
          <div> External prop value: '{someLabelFromExternalProps}' </div>

          <div className={"decorated-class-view-section"}>

            Auth context <br/>

            USERNAME: { user.isLoading ? "loading..." : user.value } <br/>

            <button disabled={user.isLoading} onClick={authActions.randomizeUser}> Randomize User </button>
            <button disabled={user.isLoading} onClick={authActions.randomizeUserAsync}> Randomize User Async </button>
            <button disabled={user.isLoading} onClick={authActions.resetUser}> Reset User </button>

          </div>

          <div className={"decorated-class-view-section"}>

            Data context <br/>
            VALUE: { value } <br/>

          </div>

        </div>

        <style>
          {
            `
              .decorated-class-view {
                border: 2px black solid;
                margin: 12px;
                padding: 12px;
              }

              .decorated-class-view-section {
                padding: 8px;
              }
            `
          }

        </style>

      </>
    );
  }

}
