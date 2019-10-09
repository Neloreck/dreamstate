import { Consume, withConsumption } from "../dreamstate";
import * as React from "react";
import { PureComponent, ReactNode } from "react";

// Data.
import { AuthContextManager, DataContextManager, IAuthContext, IDataContext } from "../data";

// Props typing: own, injected and bundled props. You should know what has to be declared manually.
export interface IHOCClassViewOwnProps {
  someLabelFromExternalProps: string;
}

export interface IHOCClassViewInjectedProps extends IAuthContext, Pick<IDataContext, "dataState"> {
}

class ClassView extends PureComponent<IHOCClassViewInjectedProps & IHOCClassViewOwnProps> {

  private static SOME_STATIC_INTERNAL: Date = new Date();

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

        <div className={"hoc-class-view"}>

          HOCClassView <br/>
          <br/>
          Static prop: { ClassView.SOME_STATIC_INTERNAL.toString() } <br/>
          <br/>
          <div> External prop value: '{someLabelFromExternalProps}' </div>

          <div className={"hoc-class-view-section"}>

            Auth context <br/>

            USERNAME: { user } <br/>
            AUTHENTICATED: { isAuthenticated.toString() } <br/>

            <button disabled={isLoading} onClick={authActions.changeAuthenticationStatus}> Change Authentication Status </button>
            <button disabled={isLoading} onClick={authActions.randomizeUser}> Randomize User </button>
            <button disabled={isLoading} onClick={authActions.randomizeUserAsync}> Randomize User Async </button>

          </div>

          <div className={"hoc-class-view-section"}>

            Data context <br/>
            VALUE: { value } <br/>

          </div>

        </div>

        <style>
          {
            `
              .hoc-class-view {
                border: 2px black solid;
                margin: 12px;
                padding: 12px;
              }

              .hoc-class-view-section {
                padding: 8px;
              }
            `
          }

        </style>

      </>
    );
  }

}

export const HOCClassView = withConsumption(AuthContextManager, { from: DataContextManager, take: [ "dataState" ] })(ClassView);
