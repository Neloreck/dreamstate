import * as React from "react";
import { Context, PureComponent, ReactNode } from "react";

// Data.
import { authContextManager, IAuthContext } from "../data";

// Props typing: own, injected and bundled props. You should know what has to be declared manually.
export interface IConsumedClassViewOwnProps {
  someLabelFromExternalProps: string;
}

export class ConsumedClassView extends PureComponent<IConsumedClassViewOwnProps, never, IAuthContext> {

  public static contextType: Context<IAuthContext> = authContextManager.getContext();

  public render(): ReactNode {

    const { someLabelFromExternalProps } = this.props;
    const { authActions, authState: { user, isAuthenticated, isLoading } } = this.context;

    return (
      <>

        <div className={"consumed-class-view"}>

          ConsumedClassView <br/>

          <div> External prop value: '{someLabelFromExternalProps}' </div>

          <div className={"consumed-class-view-section"}>

            Auth context <br/>

            USERNAME: { user } <br/>
            AUTHENTICATED: { isAuthenticated.toString() } <br/>

            <button disabled={isLoading} onClick={authActions.changeAuthenticationStatus}> Change Authentication Status </button>
            <button disabled={isLoading} onClick={authActions.randomizeUser}> Randomize User </button>
            <button disabled={isLoading} onClick={authActions.randomizeUserAsync}> Randomize User Async </button>

          </div>

        </div>

        <style>
          {
            `
              .consumed-class-view {
                border: 2px black solid;
                margin: 12px;
                padding: 12px;
              }

              .consumed-class-view-section {
                padding: 8px;
              }
            `
          }

        </style>

      </>
    );
  }

}
