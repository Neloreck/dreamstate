import { createElement, ReactElement } from "react";

export function RenderCallbacker({ onRender, ...rest }: { onRender: <T>(props: T) => void }): ReactElement {
  onRender(rest);

  return createElement("div", {}, JSON.stringify(rest));
}
