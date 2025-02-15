import { default as React, ReactElement } from "react";

import { ApplicationProvider } from "./ApplicationProvider";
import { SampleContextEditor } from "./components/SampleContextEditor";
import { SampleContextInformation } from "./components/SampleContextInformation";
import { SampleSignalsLog } from "./components/SampleSignalsLog";

/*
 * React application root rendering component.
 */
export function Application(): ReactElement {
  return (
    <ApplicationProvider>
      <SampleContextInformation/>
      <SampleContextEditor/>
      <SampleSignalsLog/>
    </ApplicationProvider>
  );
}
