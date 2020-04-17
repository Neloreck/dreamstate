import * as React from "react";
import { ReactElement } from "react";
import { useManager } from "dreamstate";

// Data.
import { AuthContextManager, DataContextManager } from "../data";

// View.
import { getFullCurrentTime } from "./utils/time";

export function FunctionalView({
  dataContext: { dataActions, dataState: { value } } = useManager(DataContextManager),
  authContext: { authActions, score } = useManager(AuthContextManager, ({ score }) => [ score ])
}): ReactElement {
  return (
    <div className={'example-view'}>

      FunctionalView: { getFullCurrentTime() } <br/>

      <div className={"example-section"}>
         <b> Auth context: </b> <br/>
         Score: { score } <br/>
         <button onClick={authActions.randomizeScore}> Randomize Score </button>
      </div>

      <div className={"example-section"}>
        <b> Data context: </b> <br/>
        Value: { value } <br/>
        <button onClick={dataActions.randomizeValue}> Randomize Value </button>
      </div>

      <p>
        This is simple functional component that consumes contexts and uses hooks. <br/>
        + React suggest such approach for new components. <br/>
        + Easy to test and write, easy typing. <br/>
        + Less reactNodes than with HoC and decorators. <br/>
        - Hard to read if component is too big.
        - By default useContext/useManager updates on any change, you should provide dependencies selector manually (example with authContext). <br/>
      </p>

    </div>
  );
}
