import { mapDreamstateErrorMessage } from "@/dreamstate/core/error/mapErrorMessage";
import { EDreamstateErrorCode } from "@/dreamstate/types";

/**
 * Error class describing generic dreamstate error.
 */
export class DreamstateError extends Error {
  /**
   * Name or error class to help differentiate error class in minimified environments.
   */
  public readonly name: string = "DreamstateError";

  /**
   * Error code describing the issues.
   */
  public readonly code: EDreamstateErrorCode;

  /**
   * Error message describing the issue.
   */
  public readonly message: string;

  public constructor(code: EDreamstateErrorCode = EDreamstateErrorCode.UNEXPECTED_ERROR, detail?: string) {
    super();

    this.code = code;
    this.message = mapDreamstateErrorMessage(code, detail);
  }
}
