import { Consume } from "dreamstate";
import * as React from "react";
import { PureComponent, ReactNode } from "react";

// Data.
import { authContextManager, dataContextManager, IAuthContext, IDataContext } from "../data";

// Props typing: own, injected and bundled props. You should know what has to be declared manually.
export interface IClassViewOwnProps {
  someLabelFromExternalProps: string;
}

export interface IClassViewInjectedProps extends IAuthContext, Pick<IDataContext, "dataState"> {
}

@Consume(authContextManager, { from: dataContextManager, take: [ "dataState" ] })
export class ClassView extends PureComponent<IClassViewInjectedProps & IClassViewOwnProps> {

  public render(): ReactNode {

    const {
      // Own prop.
      someLabelFromExternalProps,
      // Get, what you need form injected props.
      dataState: { value },
      authState: { user, isAuthenticated, isLoading },
      authActions
    } = this.props;

    return (
      <>

        <div className={"main-view"}>

          ClassView <br/>

          <div> External prop value: '{someLabelFromExternalProps}' </div>

          <div className={"main-view-section"}>

            Auth context <br/>

            USERNAME: { user } <br/>
            AUTHENTICATED: { isAuthenticated.toString() } <br/>

            <button disabled={isLoading} onClick={authActions.changeAuthenticationStatus}> Change Authentication Status </button>
            <button disabled={isLoading} onClick={authActions.randomizeUser}> Randomize User </button>
            <button disabled={isLoading} onClick={authActions.randomizeUserAsync}> Randomize User Async </button>

          </div>

          <div className={"main-view-section"}>

            Data context <br/>
            VALUE: { value } <br/>

          </div>

        </div>

        <style>
          {
            `
              .main-view {
                border: 2px black solid;
                margin: 12px;
                padding: 12px;
              }

              .main-view-section {
                padding: 8px;
              }
            `
          }

        </style>

      </>
    );
  }

}
