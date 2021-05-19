import { default as React, ReactElement } from "react";
import { ApplicationProvider } from "./ApplicationProvider";
import { SampleContextInformation } from "./components/SampleContextInformation";
import { SampleContextEditor } from "./components/SampleContextEditor";

/**
 * React application root rendering component.
 */
export function Application(): ReactElement {
  return (
    <ApplicationProvider>
      <SampleContextInformation/>
      <SampleContextEditor/>
    </ApplicationProvider>
  );
}
