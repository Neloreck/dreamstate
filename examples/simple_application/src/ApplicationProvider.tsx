import { default as React, PropsWithChildren, ReactElement } from "react";
import { createProvider, ScopeProvider } from "dreamstate";
import { SampleManager } from "./stores/SampleManager";

/**
 * Provider of sample context managers.
 */
const StoreProvider = createProvider([ SampleManager ]);

/**
 * Global application provider.
 * Here we can provide theming contexts, routing and global data configuration.
 */
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
