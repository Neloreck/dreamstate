import { useEffect, useMemo } from "react";

import { EMPTY_ARR } from "../internals";
import { IContextManagerConstructor } from "../types";
import { addManagerObserverToRegistry, registerManager, removeManagerObserverFromRegistry } from "../registry";

/**
 * Initialize context manager once before tree mount and use memo.
 * Subscribe to adding/removing observers on mount/unmount.
 */
export function useLazyInitializeManager<T extends object>(
  managerConstructor: IContextManagerConstructor<T>, updateObserver: () => void
): void {
  useMemo(function (): void { registerManager(managerConstructor); }, EMPTY_ARR);

  useEffect(() => {
    addManagerObserverToRegistry(managerConstructor, updateObserver);
    return () => removeManagerObserverFromRegistry(managerConstructor, updateObserver);
  }, EMPTY_ARR);
}
