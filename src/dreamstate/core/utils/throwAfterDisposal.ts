/**
 * Utility function that throws error on every call.
 * Intended to be placeholder when react scope is being disposed.
 */
export function throwAfterDisposal(): never {
  throw new Error("Disposed context are not supposed to access signaling scope.");
}
