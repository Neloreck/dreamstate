
import { EMPTY_ARR } from "@Lib/core/internals";
import { subscribeToSignals } from "@Lib/core/signals/subscribeToSignals";
import { unsubscribeFromSignals } from "@Lib/core/signals/unsubscribeFromSignals";
import { TCallable, TSignalListener, TSignalType } from "@Lib/core/types";
import { useEffect } from "react";

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
