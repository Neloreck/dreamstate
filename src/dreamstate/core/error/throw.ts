import { DreamstateError } from "@/dreamstate/core/error/DreamstateError";
import { EDreamstateErrorCode } from "@/dreamstate/types";

/**
 * Utility function that throws error on every call.
 * Intended to be placeholder when react scope is being disposed.
 */
export function throwAfterDisposal(): never {
  throw new DreamstateError(EDreamstateErrorCode.INSTANCE_DISPOSED);
}

/**
 * Utility function that throws error on every out of scope call.
 */
export function throwOutOfScope(): never {
  throw new DreamstateError(EDreamstateErrorCode.OUT_OF_SCOPE);
}
