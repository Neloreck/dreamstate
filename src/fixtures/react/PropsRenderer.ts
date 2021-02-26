import { createElement, PropsWithChildren, ReactElement } from "react";

import { TAnyObject } from "@/dreamstate/types";

export function PropsRenderer(props: PropsWithChildren<TAnyObject>): ReactElement {
  return createElement("div", {}, JSON.stringify(props));
}
