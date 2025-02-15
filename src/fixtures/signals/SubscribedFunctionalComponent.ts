import { createElement, ReactElement, useEffect, useState } from "react";

import { useScope } from "@/dreamstate";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { ESignal } from "@/fixtures/signals/ESignal";
import { TStringSignalEvent } from "@/fixtures/signals/types";

export function SubscribedFunctionalComponent({
  onInternalSignal,
}: {
  onInternalSignal: (signal: TStringSignalEvent) => void;
}): ReactElement {
  const { subscribeToSignals }: IScopeContext = useScope();
  const [value, setValue] = useState("initial");

  useEffect(() => {
    return subscribeToSignals((signal: TStringSignalEvent) => {
      if (signal.type === ESignal.STRING_SIGNAL) {
        setValue(signal.data);
        // Emit parent callback for testing.
        onInternalSignal(signal);
      }
    });
  }, [onInternalSignal]);

  return createElement("div", {}, value);
}
