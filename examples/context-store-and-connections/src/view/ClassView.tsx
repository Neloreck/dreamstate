import { Consume } from "dreamstate";
import * as React from "react";
import { PureComponent, ReactNode } from "react";

// Data.
import { authContextManager, dataContextManager, IAuthContext, IDataContext } from "../data";

// Props typing: own, injected and bundled props. You should know what has to be declared manually.
export interface IClassViewOwnProps { someLabelFromExternalProps: string; }
export interface IClassViewInjectedProps extends IAuthContext, IDataContext {}

@Consume(authContextManager, dataContextManager)
export class ClassView extends PureComponent<IClassViewInjectedProps & IClassViewOwnProps> {

  public render(): ReactNode {

    const {
      // Own prop.
      someLabelFromExternalProps,
      // Get, what you need form injected props.
      dataState: { value },
      dataActions,
      authState: { user, isAuthenticated, isLoading },
      authActions
    } = this.props;

    return (
      <>

        <div className={"main-view"}>

          ClassView <br/>

          <div> External prop value: '{someLabelFromExternalProps}' </div>

          <div className={"main-view-section"}>

            <span> Auth context: </span> <br/>
            <span> USERNAME: </span> {user} <br/>
            <span> AUTHENTICATED: </span>  {isAuthenticated.toString()} <br/>

            <button disabled={isLoading} onClick={authActions.changeAuthenticationStatus}> Change Authentication Status </button>
            <button disabled={isLoading} onClick={authActions.randomizeUser}> Randomize User </button>
            <button disabled={isLoading} onClick={authActions.randomizeUserAsync}> Randomize User Async </button>

          </div>

          <div className={"main-view-section"}>

            <span> Data context: </span> <br/>
            <span> VALUE: </span> {value} <br/>

            <button onClick={dataActions.randomizeValue}> Randomize Value </button>

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
