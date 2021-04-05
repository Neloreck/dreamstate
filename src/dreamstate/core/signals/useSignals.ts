import { useEffect } from "react";

import { subscribeToSignals } from "@/dreamstate/core/signals/subscribeToSignals";
import { unsubscribeFromSignals } from "@/dreamstate/core/signals/unsubscribeFromSignals";
import { TCallable, TSignalListener, TSignalType } from "@/dreamstate/types";

/**
 * Hook for signals listening and custom UI handling.
 * Provided dependencies will trigger function re-subscription.
 */
export function useSignals<
  T extends TSignalType = TSignalType,
  D = undefined
>(
  subscriber: TSignalListener<T, D>,
  dependencies: Array<any>
): void {
  useEffect(function(): TCallable {
    subscribeToSignals(subscriber);

    return function(): void {
      unsubscribeFromSignals(subscriber);
    };
  }, dependencies);
}
