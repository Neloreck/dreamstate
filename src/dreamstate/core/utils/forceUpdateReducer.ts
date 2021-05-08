import { TAnyObject } from "@/dreamstate/types";

/**
 * Reducer that returns new object every time.
 * Used for update forcing.
 */
export function forceUpdateReducer(): TAnyObject | null {
  return {};
}
