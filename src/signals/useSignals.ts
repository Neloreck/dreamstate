import { useEffect } from "react";

import { TCallable, TSignalListener, TSignalType } from "@Lib/types";
import { EMPTY_ARR } from "@Lib/internals";
import { subscribeToSignals } from "@Lib/signals/subscribeToSignals";
import { unsubscribeFromSignals } from "@Lib/signals/unsubscribeFromSignals";

/**
 * Hook for signals listening and custom UI handling.
 */
export function useSignals<D = undefined, T extends TSignalType = TSignalType>(
  subscriber: TSignalListener<D, T>
): void {
  useEffect(function(): TCallable {
    subscribeToSignals(subscriber);

    return function(): void {
      unsubscribeFromSignals(subscriber);
    };
  }, EMPTY_ARR);
}
