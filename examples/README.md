## Note

Following folder contains simple create-react-app examples with dreamstate.

### Examples:

- simple_application - simple context management and provision
- signal_application - signals emit from components/managers, subscription from components/managers
- query_application - example queries provision and usage

### Short example:

```typescript jsx
import React, { render } from "react";
import { ContextManager, ScopeProvider, createProvider, createActions, useManager } from "dreamstate";

/**
 * Declare store context.
 */
interface IExampleContext {
  exampleActions: {
    setStringValue(value: string): void;
  };
  stringValue: string;
}

/**
 * Declare store.
 */
class ExampleManager extends ContextManager<IExampleContext> {

  public context: IExampleContext = {
    exampleActions: createActions({
      setStringValue: (value: string) => this.setStringValue(value)
    }),
    stringValue: "default"
  };

  public setStringValue(value: string): void {
    this.setContext({ stringValue: value });
  }

}

/**
 * Create stores provider.
 */
const ContextProvider = createProvider([ExampleManager]);

/**
 * Root component of react application with providers.
 */
function Application() {
  return (
    <ScopeProvider>
      <ContextProvider>
        <SubscribedComponent />
      </ContextProvider>
    </ScopeProvider>
  );
}

/**
 * Some custom component subscribed to the store.
 */
function SubscribedComponent({ testContext: { stringValue, exampleActions } = useManager(ExampleManager) }) {
  return (
    <div>
      <label> Current value: </label>
      <input value={stringValue} onChange={(e) => exampleActions.setStringValue(e.target.value)} />
    </div>
  );
}

/**
 * Render react into DOM.
 */
render(<ApplicationProvider />, document.getElementById("application"));
```
