import { ScopeContext, SignalEvent, useManager, useScope } from "dreamstate";
import { ChangeEvent, CSSProperties, default as React, ReactElement, useCallback, useEffect, useState } from "react";

import { useRendersCount } from "../hooks/useRendersCount";
import { SecondManager } from "../stores/SecondManager";
import { EGenericSignal } from "../stores/signals";

const editorStyle: CSSProperties = {
  padding: "4px",
  margin: "4px",
  border: "1px solid black"
};

export function SampleSignalsLog(): ReactElement {
  const scope: ScopeContext = useScope();
  const [ signalsLog, setSignalsLog ] = useState<Array<SignalEvent>>([]);

  /**
   * Subscribe to all signals and show log of what happened in the scope.
   */
  useEffect(() => {
    /**
     * Returns un-subscriber.
     */
    return scope.subscribeToSignals((signalEvent: SignalEvent) => {
      setSignalsLog((it) => [ ...it, signalEvent ]);
    });
  }, [ scope ]);

  return (
    <div style={editorStyle}>
      <div>
        <div> Signals log: </div>
        { signalsLog.map(({ emitter, ...otherSignalFields }, index) => (
          <div key={index}>
            <span>
              [{ index }] [emitter: { emitter?.name ?? "Callback" }]
            </span>
            <span> { JSON.stringify(otherSignalFields) } </span>
          </div>
        )) }
      </div>
    </div>
  );
}
