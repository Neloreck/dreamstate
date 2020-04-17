import * as React from "react";
import { ReactElement } from "react";

// View.
import { getFullCurrentTime } from "./utils/time";

export function PropsDisplay(props: { [index: string]: any, description: string }): ReactElement {
  const { description, ...rest } = props;
  return (
    <div className={"example-view"}>
      { description } <br/>
      Render: { getFullCurrentTime() } <br/>
      Props: { JSON.stringify(rest) } <br/>
    </div>
  );
}
