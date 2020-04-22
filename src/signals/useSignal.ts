import { useEffect } from "react";

import { TSignalListener, TSignalType } from "../types";
import { EMPTY_ARR } from "../internals";
import { subscribeToSignals } from "./subscribeToSignals";
import { unsubscribeFromSignals } from "./unsubscribeFromSignals";

/**
 * Hook for signals listening and custom UI handling.
 */
export function useSignal(subscriber: TSignalListener<TSignalType, any>): void {
  useEffect(function () {
    subscribeToSignals(subscriber);
    return function () {
      unsubscribeFromSignals(subscriber);
    };
  }, EMPTY_ARR);
}