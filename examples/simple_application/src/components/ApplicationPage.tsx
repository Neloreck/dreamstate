import { default as React, ReactElement } from "react";
import { SampleContextInformation } from "./SampleContextInformation";
import { SampleContextEditor } from "./SampleContextEditor";

export function ApplicationPage(): ReactElement {
  return (
    <>
      <SampleContextInformation/>
      <SampleContextEditor/>
    </>
  );
}
