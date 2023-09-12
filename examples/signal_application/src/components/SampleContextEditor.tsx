import { ScopeContext, useManager, useScope } from "dreamstate";
import { ChangeEvent, CSSProperties, default as React, ReactElement, useCallback, useState } from "react";

import { useRendersCount } from "../hooks/useRendersCount";
import { SecondManager } from "../stores/SecondManager";
import { EGenericSignal } from "../stores/signals";

const editorStyle: CSSProperties = {
  padding: "4px",
  margin: "4px",
  border: "1px solid black"
};

export function SampleContextEditor({
  secondContext: { sampleString, sampleActions } = useManager(SecondManager, () => [])
}): ReactElement {
  const scope: ScopeContext = useScope();
  const [ localSampleString, setLocalSampleString ] = useState(sampleString);
  const rendersCount: number = useRendersCount();

  const onLocalSampleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setLocalSampleString(event.target.value);
  }, []);

  const onCommitChanges = useCallback(
    () => sampleActions.setSampleString(localSampleString),
    [ localSampleString, sampleActions ]
  );

  /**
   * Here emit signal and all subscribers do context update at once.
   * Check how many renders happened for 2 context updates per single signal.
   */
  const onRandomizeNumber = useCallback(() => {
    scope.emitSignal({ type: EGenericSignal.SAMPLE_NUMBER_CHANGED, data: Math.random() });
  }, [ scope ]);

  return (
    <div style={editorStyle}>
      <div> Editor renders count: { rendersCount } </div>

      <div>
        <button onClick={onRandomizeNumber}> Emit randomize number signal </button>
      </div>

      <div>
        <button onClick={onCommitChanges}> Commit local text changes </button>
        <input value={localSampleString} onChange={onLocalSampleChange}/>
      </div>
    </div>
  );
}
