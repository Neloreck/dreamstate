import * as React from "react";
import { ReactElement } from "react";
import { createProvider } from "dreamstate";

// Data.
import { AuthContextManager, DataContextManager } from "../data";

// View.
import { ControllerView, IControllerViewInjectedProps } from "./ControllerView";
import { ExamplesView } from "./ExamplesView";
import { getFullCurrentTime } from "./utils/time";

const ApplicationProvider = createProvider(AuthContextManager, DataContextManager);

export function ProvidedWrapper(): ReactElement {
  return (
    <ApplicationProvider>

      Rendered: { getFullCurrentTime() }

      <ControllerView {...{} as IControllerViewInjectedProps}/>

      <ExamplesView/>

    </ApplicationProvider>
  );
}
