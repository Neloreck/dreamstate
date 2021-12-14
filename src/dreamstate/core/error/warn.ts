import { log } from "@/macroses/log.macro";

/**
 * Utility function that shows dev error on every call.
 * Intended to be placeholder when react scope is being disposed.
 */
export function warnAsyncAfterDisposal(): Promise<null> {
  log.warn("Disposed contexts are not supposed to access dreamstate scope.");

  return Promise.resolve(null);
}

/**
 * Utility function that shows dev error on every call.
 * Intended to be placeholder when react scope is being disposed.
 */
export function warnSyncAfterDisposal(): null {
  log.warn("Disposed contexts are not supposed to access dreamstate scope.");

  return null;
}
