import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { Provide } from "../dreamstate";

// Data.
import { AuthContextManager, DataContextManager } from "../data";

// View.
import { FunctionalView } from "./FunctonalView";
import { ConsumedClassView } from "./ConsumedClassView";
import { DecoratedClassView, IDecoratedClassViewInjectedProps } from "./DecoratedClassView";
import { HOCClassView, IHOCClassViewInjectedProps } from "./HOCClassView";

@Provide(AuthContextManager, DataContextManager)
export class ProvidedWrapper extends PureComponent {

  public render(): ReactNode {

    return (
      <>

        <div> Components are connected to the same store, so they are in total sync. </div>

        <DecoratedClassView someLabelFromExternalProps={"First component."} {...{} as IDecoratedClassViewInjectedProps}/>

        <HOCClassView someLabelFromExternalProps={"First component."} {...{} as IHOCClassViewInjectedProps}/>

        <FunctionalView/>

        <ConsumedClassView someLabelFromExternalProps={"Second component."}/>

      </>
    );
  }

}
