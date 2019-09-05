import * as React from "react";
import { render } from "react-dom";
import { PureComponent, ReactNode } from "react";
import { Provide } from "dreamstate";

// Data.
import { authContextManager, dataContextManager } from "./data";

// View.
import { ClassView, IClassViewInjectedProps } from "./view/ClassView";
import { FunctionalView } from "./view/FunctonalView";

@Provide(authContextManager, dataContextManager)
export class Root extends PureComponent {

  public render(): ReactNode {

    return (
      <>

        <div> Components are connected to the same store, so they are in total sync: </div>

        <ClassView someLabelFromExternalProps={"First component."} {...{} as IClassViewInjectedProps}/>

        <FunctionalView/>

        <ClassView someLabelFromExternalProps={"Second component."} {...{} as IClassViewInjectedProps}/>

      </>
    );
  }

}

render(<Root/>, document.getElementById("application-root"));
