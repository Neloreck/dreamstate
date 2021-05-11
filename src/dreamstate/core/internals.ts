import type { Context } from "react";

import type { TAnyContextManagerConstructor } from "@/dreamstate/types";

/**
 * Meta symbols for private internals in context managers.
 */
export const SIGNAL_METADATA_SYMBOL: unique symbol = Symbol("SIGNAL_METADATA");
export const QUERY_METADATA_SYMBOL: unique symbol = Symbol("QUERY_METADATA");
export const SIGNALING_HANDLER_SYMBOL: unique symbol = Symbol("SIGNALING_HANDLER");
export const SCOPE_SYMBOL: unique symbol = Symbol("SCOPE");

/**
 * Weak store of react context internals bound to a specific manager class.
 */
export const CONTEXT_REACT_CONTEXTS_REGISTRY: WeakMap<TAnyContextManagerConstructor, Context<any>> = new WeakMap();
