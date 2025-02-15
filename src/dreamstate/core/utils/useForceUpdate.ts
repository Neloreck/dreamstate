import { useReducer } from "react";

import { TAnyObject, TCallable } from "@/dreamstate/types";

/**
 * A reducer function that forces a state update by returning a new object on each call.
 * This is used to trigger re-renders in React components, as the hooks API does not directly
 *   support state updates that would trigger a re-render without modifying the state.
 *
 * @returns {TAnyObject | null} A new object that forces an update, or null if no update is necessary.
 *   The returned object could be used to force a re-render by replacing the current state.
 */
export function forceUpdateReducer(): TAnyObject | null {
  return {};
}

/**
 * Custom hook that provides a function to force a re-render of the component.
 * This hook uses a reducer that returns a new object on every call, which is
 * leveraged to trigger component updates.
 *
 * @returns {TCallable} A function that, when called, forces a re-render of the component.
 *   This function can be invoked to trigger a state update and cause a re-render.
 */
export function useForceUpdate(): TCallable {
  return useReducer(forceUpdateReducer, null)[1];
}
