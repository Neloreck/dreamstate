import * as React from "react";
import { ReactElement } from "react";
import { useManager } from "dreamstate";

// Data.
import {authContextManager, dataContextManager} from "../data";

export function FunctionalView(): ReactElement {

  const { authActions, authState: { isAuthenticated, isLoading, user } } = useManager(authContextManager);
  const { dataActions, dataState: { value } } = useManager(dataContextManager);

  return (
    <>

      <div className={'functional-view'}>

        FunctionalView <br/>

        <div className={"functional-view-section"}>

          <span> Auth context: </span> <br/>
          <span> USERNAME: </span> {user} <br/>
          <span> AUTHENTICATED: </span>  {isAuthenticated.toString()} <br/>

          <button disabled={isLoading} onClick={authActions.changeAuthenticationStatus}> Change Authentication Status </button>
          <button disabled={isLoading} onClick={authActions.randomizeUser}> Randomize User </button>
          <button disabled={isLoading} onClick={authActions.randomizeUserAsync}> Randomize User Async </button>

        </div>

        <div className={"functional-view-section"}>

          <span> Data context: </span> <br/>
          <span> VALUE: </span> {value} <br/>

          <button onClick={dataActions.randomizeValue}> Randomize Value </button>

        </div>

      </div>

      <style>

        {
          `
          .functional-view {
            border: 2px black solid;
            margin: 12px;
            padding: 12px;
          }

          .functional-view-section {
            padding: 8px;
          }
        `
        }

      </style>

    </>
  );
}