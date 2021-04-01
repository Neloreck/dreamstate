import { createElement, ReactElement, useState } from "react";

import { useSignals } from "@/dreamstate";
import { ESignal } from "@/fixtures/signals/ESignal";
import { TStringSignalEvent } from "@/fixtures/signals/types";

export function SubscribedFunctionalComponent({
  onInternalSignal
}: { onInternalSignal: (signal: TStringSignalEvent) => void }): ReactElement {
  const [ value, setValue ] = useState("initial");

  useSignals((signal: TStringSignalEvent) => {
    if (signal.type === ESignal.STRING_SIGNAL) {
      setValue(signal.data);
      // Emit parent callback for testing.
      onInternalSignal(signal);
    }
  }, [ onInternalSignal ]);

  return createElement("div", {}, value);
}
