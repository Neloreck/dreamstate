import { useEffect } from "react";

import { TSignalListener, TSignalType } from "../types";
import { EMPTY_ARR } from "../internals";
import { subscribeToSignals } from "./subscribeToSignals";
import { unsubscribeFromSignals } from "./unsubscribeFromSignals";

/**
 * Hook for signals listening and custom UI handling.
 */
export function useSignals<D = undefined, T extends TSignalType = TSignalType>(
  subscriber: TSignalListener<D, T>
): void {
  useEffect(function () {
    subscribeToSignals(subscriber);

    return function () {
      unsubscribeFromSignals(subscriber);
    };
  }, EMPTY_ARR);
}
