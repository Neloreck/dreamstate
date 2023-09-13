import { log } from "@/macroses/log.macro";

import { DreamstateError } from "@/dreamstate";
import { EDreamstateErrorCode } from "@/dreamstate/types";

/**
 * Utility function that shows dev error on every call.
 * Intended to be placeholder when react scope is being disposed.
 */
export function warnSyncAfterDisposal(): null {
  if (IS_DEV) {
    log.warn(new DreamstateError(EDreamstateErrorCode.INSTANCE_DISPOSED_LIFECYCLE).stack);
  }

  return null;
}
