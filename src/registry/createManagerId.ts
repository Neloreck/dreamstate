import {
  CONTEXT_OBSERVERS_REGISTRY,
  CONTEXT_QUERY_METADATA_REGISTRY,
  CONTEXT_SIGNAL_METADATA_REGISTRY,
  CONTEXT_STATES_REGISTRY,
  CONTEXT_SUBSCRIBERS_REGISTRY
} from "../internals";

import { log } from "../../build/macroses/log.macro";

/**
 * Create manager ID and init related registry data.
 */
export function createManagerId(description: string): symbol {
  const id: symbol = Symbol(description);

  /**
   * After manager ID resolving all related data should be initialized.
   */
  CONTEXT_STATES_REGISTRY[id as any] = {};
  CONTEXT_OBSERVERS_REGISTRY[id as any] = new Set();
  CONTEXT_SUBSCRIBERS_REGISTRY[id as any] = new Set();
  CONTEXT_SIGNAL_METADATA_REGISTRY[id as any] = [];
  CONTEXT_QUERY_METADATA_REGISTRY[id as any] = [];

  log.info("Context manager id defined:", id, description);

  return id;
}
