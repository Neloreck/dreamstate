import * as React from "react";
import { ReactElement } from "react";
import { createProvider } from "../dreamstate";

// Data.
import { AuthContextManager, DataContextManager } from "../data";

// View.
import { FunctionalView } from "./FunctonalView";
import { ConsumedClassView } from "./ConsumedClassView";
import { DecoratedClassView, IDecoratedClassViewInjectedProps } from "./DecoratedClassView";
import { HOCClassView, IHOCClassViewInjectedProps } from "./HOCClassView";
import { getFullCurrentTime } from "./utils/time";

const ApplicationProvider = createProvider(AuthContextManager, DataContextManager);

export function ProvidedWrapper(): ReactElement {
  return (
    <ApplicationProvider>

      Rendered: { getFullCurrentTime() }

      <ConsumedClassView/>

      <FunctionalView/>

      <DecoratedClassView {...{} as IDecoratedClassViewInjectedProps}/>

      <HOCClassView {...{} as IHOCClassViewInjectedProps}/>

    </ApplicationProvider>
  );
}
