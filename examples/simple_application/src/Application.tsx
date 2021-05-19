import { default as React, ReactElement } from "react";
import { ApplicationProvider } from "./ApplicationProvider";
import { ApplicationPage } from "./components/ApplicationPage";

export function Application(): ReactElement {
  return (
    <ApplicationProvider>
      <ApplicationPage/>
    </ApplicationProvider>
  );
}
