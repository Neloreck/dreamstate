import type { ReactNode } from "react";

export interface IProviderProps<T> {
  initialState?: T;
  partialHotReplacement?: boolean;
  children?: ReactNode;
}
