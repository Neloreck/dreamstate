import { useEffect, useMemo } from "react";

import { EMPTY_ARR } from "../internals";
import { TAnyContextManagerConstructor, TDreamstateWorker } from "../types";
import { addWorkerObserverToRegistry, registerWorker, removeWorkerObserverFromRegistry } from "../registry";

/**
 * Initialize context manager once before tree mount and use memo.
 * Subscribe to adding/removing observers on mount/unmount.
 */
export function useLazyInitializeWorker(
  workerConstructor: TDreamstateWorker,
  updateObserver: () => void
): void {
  useMemo(function (): void {
    registerWorker(workerConstructor);
  }, EMPTY_ARR);

  useEffect(function () {
    addWorkerObserverToRegistry(workerConstructor as TAnyContextManagerConstructor, updateObserver);

    return function () {
      return removeWorkerObserverFromRegistry(workerConstructor as TAnyContextManagerConstructor, updateObserver);
    };
  }, EMPTY_ARR);
}
