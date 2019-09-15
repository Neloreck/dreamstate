import * as React from "react";
import { render } from "react-dom";
import { PureComponent, ReactNode } from "react";
import { Bind } from "./dreamstate";

// View.
import { ProvidedWrapper } from "./view/ProvidedWrapper";

export interface IRootState {
  enabled: boolean;
}

export class Root extends PureComponent<object, IRootState> {

  public state: IRootState = {
    enabled: true
  };

  public render(): ReactNode {

    const { enabled } = this.state;

    return (
      <>

        <button onClick={this.onToggleRendering}> Toggle Rendering </button>

        { enabled ? <ProvidedWrapper/> : null }

      </>
    );
  }

  @Bind()
  private onToggleRendering(): void {

    const { enabled } = this.state;

    this.setState({ enabled: !enabled })
  }

}

render(<Root/>, document.getElementById("application-root"));
