import { Consume, Provide } from "dreamstate";
import * as React from "react";
import { PureComponent, ReactNode } from "react";

// Store related things.
import { authContextManager, dataContextManager, IAuthContext, IDataContext } from "../data";

// Props typing: own, injected and bundled props. You should know what has to be declared manually.
export interface IMainViewOwnProps { someLabelFromExternalProps: string; }
export interface IMainViewExternalProps extends IAuthContext, IDataContext {}

// Component related.
@Provide(authContextManager, dataContextManager)
@Consume(authContextManager, dataContextManager)
export class MainView extends PureComponent<IMainViewExternalProps & IMainViewOwnProps> {

  public render(): ReactNode {

    const {
      // Own prop.
      someLabelFromExternalProps,
      // Get, what you need form injected props.
      dataState: {value},
      dataActions: {randomizeValue},
      authState: {user, isAuthenticated},
      authActions: {randomizeUser, randomizeUserAsync, changeAuthenticationStatus}
    } = this.props;

    const rootStyle = { border: "2px black solid", margin: 12, padding: 12 };
    const sectionStyle = { padding: 8 };

    return (
      <div style={rootStyle}>

        <div> External prop value: '{ someLabelFromExternalProps }' </div>

        <div style={sectionStyle}>

          <span> Auth context: </span>
          <span> USERNAME: </span> {user} <br/>
          <span> AUTHENTICATED: </span>  {isAuthenticated.toString()} <br/>
  
          <button onClick={changeAuthenticationStatus}>Change Authentication Status</button>
          <button onClick={randomizeUserAsync}>Randomize User Async</button>
          <button onClick={randomizeUser}>Randomize User</button>
       
        </div>

        <div style={sectionStyle}>

          <span> Data context: </span>
          <span> VALUE: </span> {value} <br/>

          <button onClick={randomizeValue}>Randomize Value</button>

        </div>

      </div>
    );
  }

}
