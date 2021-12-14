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

  public readonly detail?: string;

  public constructor(code: EDreamstateErrorCode = EDreamstateErrorCode.UNEXPECTED_ERROR, detail?: string) {
    super();

    this.code = code;
    this.detail = detail;
    this.message = this.getMessage();
  }

  /**
   * Get message based on current error code.
   */
  public getMessage(): string {
    switch (this.code) {
      case EDreamstateErrorCode.INSTANCE_DISPOSED:
        return "Disposed instances are not supposed to access scope.";
      case EDreamstateErrorCode.OUT_OF_SCOPE:
        return "Instance is out of scope, make sure it is created or mocked correctly.";
      case EDreamstateErrorCode.INCORRECT_PARAMETER:
        return `Incorrect parameter supplied.${this.detail ? ` ${this.detail}` : ""}`;
      case EDreamstateErrorCode.INCORRECT_SIGNAL_TYPE:
        return `Unexpected signal type provided, expected symbol, string or number.${
          this.detail ? ` Got: '${this.detail}' instead.` : ""
        }`;
      case EDreamstateErrorCode.INCORRECT_SIGNAL_LISTENER:
        return `Signal listener must be function, '${this.detail}' provided.`;
      case EDreamstateErrorCode.INCORRECT_QUERY_TYPE:
        return `Unexpected query type provided, expected symbol, string or number. Got: '${this.detail}' instead.`;
      case EDreamstateErrorCode.INCORRECT_QUERY_PROVIDER:
        return `Query provider must be factory function, '${this.detail}' provided.`;
      case EDreamstateErrorCode.TARGET_CONTEXT_MANAGER_EXPECTED:
        return `Cannot perform action, class extending ContextManager is expected.${
          this.detail ? ` ${this.detail}` : ""
        }`;
      case EDreamstateErrorCode.RESTRICTED_OPERATION:
        return `Operation is restricted.${this.detail ? ` ${this.detail}` : ""}`;
      case EDreamstateErrorCode.UNEXPECTED_ERROR:
      default:
        return "Unexpected dreamstate error.";
    }
  }

}
