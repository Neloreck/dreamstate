import { TAnyObject } from "@/dreamstate/types";

/**
 * Reducer that returns new object on every update.
 * Used for update forcing because hooks api does not support anything else.
 */
export function forceUpdateReducer(): TAnyObject | null {
  // todo: Add useForceUpdate hook instead.
  return {};
}
