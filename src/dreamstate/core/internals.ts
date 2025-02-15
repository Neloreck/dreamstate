import type { Context } from "react";

import type {
  TAnyContextManagerConstructor,
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
 * Weak store of react context internals bound to a specific manager class.
 *
 * Weak maps are required because library should not affect external code on general basis.
 * We cannot guarantee that used manager classes are still needed and should not catch them in global collections.
 * Every singleton/descriptive value can be stored in global collection to unlink it from specific reference.
 *
 * Example cases: HMR, module unloads, scope disposal etc.
 */
export const CONTEXT_REACT_CONTEXTS_REGISTRY: WeakMap<TAnyContextManagerConstructor, Context<any>> = new WeakMap();

export const SIGNAL_METADATA_REGISTRY: WeakMap<TAnyContextManagerConstructor, TSignalSubscriptionMetadata> =
  new WeakMap();

export const QUERY_METADATA_REGISTRY: WeakMap<TAnyContextManagerConstructor, TQuerySubscriptionMetadata> =
  new WeakMap();
