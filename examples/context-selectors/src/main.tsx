import * as React from "react";
import { render } from "react-dom";
import { useState, useCallback, ReactElement } from "react";

// View.
import { ProvidedWrapper } from "./view/ProvidedWrapper";

export function Root(): ReactElement {
  const [ enabled, setEnabled ] = useState(true);
  const onToggleRendering = useCallback(() => setEnabled(!enabled), [ enabled ]);

  return (
    <>

      <button onClick={onToggleRendering}> Toggle Rendering </button>

      { enabled ? <ProvidedWrapper/> : null }

      <style>
        {
          `
            button {
              margin-right: 8px;
            }
    
            #application-root {
              box-sizing: border-box;
              padding: 12px;
            }  
    
            .example-view {
              border: 2px black solid;
              margin: 12px 0;
              padding: 12px;
            }
    
            .example-section {
              border: 2px black solid;
              padding: 8px;
              margin-top: 8px;
            }
          `
        }
      </style>

    </>
  );
}

render(<Root/>, document.getElementById("application-root"));
