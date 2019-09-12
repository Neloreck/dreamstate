import * as React from "react";
import { render } from "react-dom";
import { PureComponent, ReactNode } from "react";
import { Provide } from "./dreamstate";

// Data.
import { authContextManager, dataContextManager } from "./data";

// View.
import { FunctionalView } from "./view/FunctonalView";
import { ConsumedClassView } from "./view/ConsumedClassView";
import { DecoratedClassView, IDecoratedClassViewInjectedProps } from "./view/DecoratedClassView";

@Provide(authContextManager, dataContextManager)
export class Root extends PureComponent {

  public render(): ReactNode {

    return (
      <>

        <div> Components are connected to the same store, so they are in total sync: </div>

        <DecoratedClassView someLabelFromExternalProps={"First component."} {...{} as IDecoratedClassViewInjectedProps}/>

        <FunctionalView/>

        <ConsumedClassView someLabelFromExternalProps={"Second component."}/>

      </>
    );
  }

}

render(<Root/>, document.getElementById("application-root"));
