import type { Context } from "react";

import type {
  TAnyContextManagerConstructor,
  TAnyValue,
  TQuerySubscriptionMetadata,
  TSignalSubscriptionMetadata,
} from "@/dreamstate/types";

/**
 * Meta symbols for private internals in context managers.
 */
export const SIGNAL_METADATA_SYMBOL: unique symbol = Symbol("SIGNAL_METADATA");
export const QUERY_METADATA_SYMBOL: unique symbol = Symbol("QUERY_METADATA");
export const SIGNALING_HANDLER_SYMBOL: unique symbol = Symbol("SIGNALING_HANDLER");
export const SCOPE_SYMBOL: unique symbol = Symbol("SCOPE");

/**
 * A weak map registry that stores React context instances bound to specific manager classes.
 *
 * This registry ensures that the library does not retain unnecessary references to manager classes,
 * preventing memory leaks and unintended side effects.
 *
 * This is particularly useful in scenarios such as:
 * - Hot Module Replacement
 * - Module unloading
 * - Scope disposal
 */
export const CONTEXT_REACT_CONTEXTS_REGISTRY: WeakMap<
  TAnyContextManagerConstructor,
  Context<TAnyValue>
> = new WeakMap();

export const SIGNAL_METADATA_REGISTRY: WeakMap<TAnyContextManagerConstructor, TSignalSubscriptionMetadata> =
  new WeakMap();

export const QUERY_METADATA_REGISTRY: WeakMap<TAnyContextManagerConstructor, TQuerySubscriptionMetadata> =
  new WeakMap();
