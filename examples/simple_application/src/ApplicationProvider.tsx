import { default as React, PropsWithChildren, ReactElement } from "react";
import { createProvider, ScopeProvider } from "dreamstate";
import { SampleContextManager } from "./stores/SampleContextManager";

/**
 * Provider of sample context managers.
 */
const StoreProvider = createProvider([ SampleContextManager ]);

export function ApplicationProvider({ children }: PropsWithChildren<{}>): ReactElement {
  return (
    /**
     * Provide scope for current context managers above them in react tree.
     * Provide desired managers in current scope.
     */
    <ScopeProvider>
      <StoreProvider>
        { children }
      </StoreProvider>
    </ScopeProvider>
  );
}