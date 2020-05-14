import { useEffect } from "react";

import { EMPTY_ARR } from "@/dreamstate/core/internals";
import { subscribeToSignals } from "@/dreamstate/signals/subscribeToSignals";
import { unsubscribeFromSignals } from "@/dreamstate/signals/unsubscribeFromSignals";
import { TCallable, TSignalListener, TSignalType } from "@/dreamstate/types";

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
