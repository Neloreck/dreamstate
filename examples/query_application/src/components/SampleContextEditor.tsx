import { ScopeContext, useManager, useScope } from "dreamstate";
import { ChangeEvent, CSSProperties, default as React, ReactElement, useCallback, useEffect, useState } from "react";

import { useRendersCount } from "../hooks/useRendersCount";
import { FirstManager } from "../stores/FirstManager";
import { EGenericQuery } from "../stores/queries";
import { SecondManager } from "../stores/SecondManager";

const editorStyle: CSSProperties = {
  padding: "4px",
  margin: "4px",
  border: "1px solid black"
};

export function SampleContextEditor({
  firstContext: { firstActions } = useManager(FirstManager),
  secondContext: { sampleNumber, secondActions } = useManager(SecondManager)
}): ReactElement {
  const scope: ScopeContext = useScope();
  const rendersCount: number = useRendersCount();

  const [ localSampleNumber, setLocalSampleNumber ] = useState(sampleNumber);
  const [ queryProvidedString, setQueryProvidedString ] = useState("provided sample");

  const onLocalSampleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setLocalSampleNumber(Number.parseInt(event.target.value));
  }, []);

  const onQueryProvidedStringChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQueryProvidedString(event.target.value);
  }, []);

  const onCommitChanges = useCallback(
    () => secondActions.setSampleNumber(localSampleNumber),
    [ localSampleNumber, secondActions ]
  );

  /**
   * Add provider that listens all STRING_FROM_COMPONENT queries and responds with local value.
   * Keep it sync always using effect dependencies.
   */
  useEffect(() => {
    /**
     * Make sure you return un-subscriber automatically (like here).
     * Or return callback that does scope.unRegisterQueryProvider.
     */

    return scope.registerQueryProvider(EGenericQuery.STRING_FROM_COMPONENT, () => queryProvidedString);
  }, [ scope, queryProvidedString ]);

  return (
    <div style={editorStyle}>
      <div> Editor renders count: { rendersCount } </div>

      <div>
        <button onClick={onCommitChanges}> Save to manager </button>
        <input value={localSampleNumber} onChange={onLocalSampleChange}/>
      </div>

      <div>
        <button onClick={firstActions.updateMultipliedNumberValue}> Sync first manager with second manager </button>
      </div>
      <br/>
      <div>
        <div> Provided string from this component: </div>
        <input value={queryProvidedString} onChange={onQueryProvidedStringChanged}/>
      </div>
    </div>
  );
}
