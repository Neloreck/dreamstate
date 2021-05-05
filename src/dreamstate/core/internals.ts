import type { Context } from "react";

import type { TAnyContextManagerConstructor } from "@/dreamstate/types";

/**
 * Global shared constants.
 */

export const EMPTY_ARR: [] = [];

export const SIGNAL_METADATA_SYMBOL: unique symbol = Symbol.for("SIGNAL_METADATA");

export const QUERY_METADATA_SYMBOL: unique symbol = Symbol.for("QUERY_METADATA");

export const SIGNALING_HANDLER_SYMBOL: unique symbol = Symbol.for("SIGNALING_HANDLER");

export const SCOPE_SYMBOL: unique symbol = Symbol.for("SCOPE");

/**
 * Store related constants.
 */

// ReactContext registry, lazy initialized constants.
export const CONTEXT_REACT_CONTEXTS_REGISTRY: WeakMap<TAnyContextManagerConstructor, Context<any>> = new WeakMap();
