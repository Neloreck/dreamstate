import { useManager } from "dreamstate";
import { CSSProperties, default as React, ReactElement } from "react";

import { useRendersCount } from "../hooks/useRendersCount";
import { FirstManager } from "../stores/FirstManager";
import { SecondManager } from "../stores/SecondManager";

const informationStyle: CSSProperties = {
  padding: "4px",
  margin: "4px",
  border: "1px solid black",
};

export function SampleContextInformation({
  firstContext: { sampleNumber: firstSampleNumber, reflectedString } = useManager(FirstManager),
  secondContext: { sampleString, sampleNumber: secondSampleNumber } = useManager(SecondManager),
}): ReactElement {
  /**
   * Update on every context update and keep current component up-to-date always.
   */

  const rendersCount: number = useRendersCount();

  return (
    <div style={informationStyle}>
      <div> Information renders count: { rendersCount } </div>

      <div> First sample number: { firstSampleNumber } </div>
      <div> Second sample number: { secondSampleNumber } </div>

      <div> Sample string: { sampleString } </div>
      <div> Reflected string: { reflectedString } </div>
    </div>
  );
}
