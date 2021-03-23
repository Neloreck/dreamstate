import { useEffect } from "react";

import { EMPTY_ARR } from "@/dreamstate/core/internals";
import { subscribeToSignals } from "@/dreamstate/core/signals/subscribeToSignals";
import { unsubscribeFromSignals } from "@/dreamstate/core/signals/unsubscribeFromSignals";
import { TCallable, TSignalListener, TSignalType } from "@/dreamstate/types";

/**
 * Hook for signals listening and custom UI handling.
 */
export function useSignals<T extends TSignalType = TSignalType, D = undefined>(
  subscriber: TSignalListener<T, D>
): void {
  useEffect(function(): TCallable {
    subscribeToSignals(subscriber);

    return function(): void {
      unsubscribeFromSignals(subscriber);
    };
  }, EMPTY_ARR);
}
