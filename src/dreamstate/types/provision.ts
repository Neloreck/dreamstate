import type { ReactNode } from "react";

/**
 * Properties for the Dreamstate context manager provider.
 * Defines the props used for initializing and configuring the provider.
 */
export interface IProviderProps<T> {
  initialState?: T;
  partialHotReplacement?: boolean;
  children?: ReactNode;
}
