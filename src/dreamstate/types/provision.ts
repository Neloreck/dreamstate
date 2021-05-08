import type { ReactNode } from "react";

/**
 * Dreamstate context manager providers props.
 */
export interface IProviderProps<T> {
  initialState?: T;
  partialHotReplacement?: boolean;
  children?: ReactNode;
}
