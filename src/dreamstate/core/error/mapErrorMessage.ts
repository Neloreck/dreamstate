import { EDreamstateErrorCode } from "@/dreamstate/types";

/**
 * Maps a Dreamstate error code to a human-readable error message.
 *
 * This function takes an error code and an optional detail string, returning a formatted
 * error message that provides more context about the error. It's useful for handling and
 * displaying Dreamstate-specific errors in a user-friendly way.
 *
 * @param {EDreamstateErrorCode} code - The error code representing the specific Dreamstate error.
 * @param {string} [detail] - An optional string providing additional details to be included
 *   in the error message.
 * @returns {string} A formatted error message based on the provided error code and details.
 */
export function mapDreamstateErrorMessage(code: EDreamstateErrorCode, detail?: string): string {
  switch (code) {
    case EDreamstateErrorCode.INSTANCE_DISPOSED_LIFECYCLE:
      return "Disposed manager instances are not supposed to access lifecycle.";
    case EDreamstateErrorCode.INSTANCE_DISPOSED_SCOPE:
      return "Disposed manager instances are not supposed to access scope.";
    case EDreamstateErrorCode.OUT_OF_SCOPE:
      return "Instance is out of scope, make sure it is created or mocked correctly.";
    case EDreamstateErrorCode.INCORRECT_PARAMETER:
      return `Incorrect parameter supplied.${detail ? ` ${detail}` : ""}`;
    case EDreamstateErrorCode.INCORRECT_SIGNAL_TYPE:
      return `Unexpected signal type provided, expected symbol, string or number.${
        detail ? ` Got: '${detail}' instead.` : ""
      }`;
    case EDreamstateErrorCode.INCORRECT_SIGNAL_LISTENER:
      return `Signal listener must be function, '${detail}' provided.`;
    case EDreamstateErrorCode.INCORRECT_QUERY_TYPE:
      return `Unexpected query type provided, expected symbol, string or number. Got: '${detail}' instead.`;
    case EDreamstateErrorCode.INCORRECT_QUERY_PROVIDER:
      return `Query provider must be factory function, '${detail}' provided.`;
    case EDreamstateErrorCode.TARGET_CONTEXT_MANAGER_EXPECTED:
      return `Cannot perform action, class extending ContextManager is expected.${detail ? ` ${detail}` : ""}`;
    case EDreamstateErrorCode.RESTRICTED_OPERATION:
      return `Operation is restricted.${detail ? ` ${detail}` : ""}`;
    case EDreamstateErrorCode.UNEXPECTED_ERROR:
    default:
      return `Unexpected dreamstate error.${detail ? ` ${detail}` : ""}`;
  }
}
