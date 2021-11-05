/**
 * Utility function that throws error on every out of scope call.
 */
export function throwOutOfScope(): never {
  throw new Error("Operation is not permitted, currently out of scope.");
}
