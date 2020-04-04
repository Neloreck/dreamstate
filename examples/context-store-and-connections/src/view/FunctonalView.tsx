import * as React from "react";
import { ReactElement } from "react";
import { useManager } from "../dreamstate";

// Data.
import {  DataContextManager } from "../data";

export function FunctionalView(): ReactElement {

  const { dataActions, dataState: { value } } = useManager(DataContextManager);

  return (
    <>

      <div className={'functional-view'}>

        FunctionalView <br/>

        <div className={"functional-view-section"}>

           Data context <br/>
           VALUE: { value } <br/>

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
