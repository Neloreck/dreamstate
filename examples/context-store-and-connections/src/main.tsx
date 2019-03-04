import * as React from "react";
import { render } from "react-dom";

import { MainView, IMainViewExternalProps } from "./view/MainView";

render(
  <div>

    <div> Both components are connected to the same store, so they are in total sync: </div>

    <MainView someLabelFromExternalProps={"First component."} {...{} as IMainViewExternalProps}/>
    <MainView someLabelFromExternalProps={"Second component."} {...{} as IMainViewExternalProps}/>

  </div>,
  document.getElementById("application-root")
);
