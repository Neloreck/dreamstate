import { DreamstateError } from "@/dreamstate/core/error/DreamstateError";
import { TCallable } from "@/dreamstate/types";

/**
 * Testing util.
 * Use for getting error and checking it in expect clause.
 */
export function getCallableError<T extends Error>(callable: TCallable): T {
  try {
    callable();
    throw new DreamstateError();
  } catch (error: unknown) {
    return error as T;
  }
}
