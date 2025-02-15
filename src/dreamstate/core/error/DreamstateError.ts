import { mapDreamstateErrorMessage } from "@/dreamstate/core/error/mapErrorMessage";
import { EDreamstateErrorCode } from "@/dreamstate/types";

/**
 * A custom error class that contains generic error information for Dreamstate-related issues.
 *
 * This class extends the native `Error` class and is used to represent errors specific
 * to the Dreamstate library, providing more structured error handling.
 */
export class DreamstateError extends Error {
  /**
   * Name or error class to help differentiate error class in minified environments.
   */
  public readonly name: string = "DreamstateError";
  /**
   * Error code describing the issue.
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
