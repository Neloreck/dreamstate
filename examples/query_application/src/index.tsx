import React from "react";
import { Root, createRoot } from "react-dom/client";

import { Application } from "./Application";

const root: Root = createRoot(document.getElementById("root") as HTMLElement);

root.render(<Application/>);
