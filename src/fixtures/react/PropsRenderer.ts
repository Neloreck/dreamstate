import { createElement, PropsWithChildren, ReactElement } from "react";

export function PropsRenderer(props: PropsWithChildren<object>): ReactElement {
  return createElement("div", {}, JSON.stringify(props));
}
