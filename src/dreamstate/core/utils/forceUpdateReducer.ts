import { TAnyObject } from "@/dreamstate/types";

/**
 * A reducer function that forces a state update by returning a new object on each call.
 * This is used to trigger re-renders in React components, as the hooks API does not directly
 *   support state updates that would trigger a re-render without modifying the state.
 *
 * @returns {TAnyObject | null} A new object that forces an update, or null if no update is necessary.
 *   The returned object could be used to force a re-render by replacing the current state.
 */
export function forceUpdateReducer(): TAnyObject | null {
  // todo: Add useForceUpdate hook instead.
  return {};
}
