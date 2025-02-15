import { useManager } from "dreamstate";
import { CSSProperties, default as React, ReactElement } from "react";

import { useRendersCount } from "../hooks/useRendersCount";
import { SampleManager } from "../stores/SampleManager";

const informationStyle: CSSProperties = {
  padding: "4px",
  margin: "4px",
  border: "1px solid black",
};

/*
 * Update on every context update and keep current component up-to-date always.
 */
export function SampleContextInformation({
  sampleContext: { sampleNumber, sampleString } = useManager(SampleManager),
}): ReactElement {
  const rendersCount: number = useRendersCount();

  return (
    <div style={informationStyle}>
      <div> Information renders count: {rendersCount} </div>
      <div> Sample number: {sampleNumber} </div>
      <div> Sample string: {sampleString} </div>
    </div>
  );
}
