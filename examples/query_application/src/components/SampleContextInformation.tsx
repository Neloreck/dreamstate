import { ScopeContext, useManager, useScope } from "dreamstate";
import { CSSProperties, default as React, ReactElement, useCallback, useState } from "react";

import { useRendersCount } from "../hooks/useRendersCount";
import { FirstManager } from "../stores/FirstManager";
import { EGenericQuery, TStringFromComponentQueryResponse } from "../stores/queries";
import { SecondManager } from "../stores/SecondManager";

const informationStyle: CSSProperties = {
  padding: "4px",
  margin: "4px",
  border: "1px solid black"
};

export function SampleContextInformation({
  firstContext: { multipliedNumber } = useManager(FirstManager),
  secondContext: { sampleNumber } = useManager(SecondManager)
}): ReactElement {
  const scope: ScopeContext = useScope();
  const rendersCount: number = useRendersCount();

  const [ queryValueFromComponent, setQueryValueFromComponent ] = useState("");

  const onSyncQueryValueFromComponent = useCallback(() => {
    const { data }: TStringFromComponentQueryResponse = scope.queryDataSync({
      type: EGenericQuery.STRING_FROM_COMPONENT
    });

    setQueryValueFromComponent(data);
  }, [ scope ]);

  return (
    <div style={informationStyle}>
      <div> Information renders count: { rendersCount } </div>

      <div> First context multiplied number: { multipliedNumber } </div>
      <div> Second context sample number: { sampleNumber } </div>
      <br/>
      <div> Queried value from component: { queryValueFromComponent } </div>
      <button onClick={onSyncQueryValueFromComponent}> Get value from another component </button>
    </div>
  );
}
