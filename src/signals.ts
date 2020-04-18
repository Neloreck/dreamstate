import { TSignalListener, TSignalType } from "./types";
import { ContextManager } from "./ContextManager";

export const SIGNAL_REGISTRY: {
  LISTENERS: Set<TSignalListener<any>>;
} = {
  LISTENERS: new Set()
};

export function emitSignal<T extends object>(
  type: TSignalType,
  data: T,
  emitter: ContextManager<any>
): void {
  SIGNAL_REGISTRY.LISTENERS.forEach(function (it: TSignalListener<any>) {
    // Async query.
    setTimeout(function () {
      it(type, data, emitter);
    });
  });
}

/**
 * Subscribe to all signals and listen everything.
 * Should be filtered by users like redux does.
 * Not intended to be used as core feature, just for some elegant decisions.
 */
export function subscribeToSignals(listener: TSignalListener<any>): void {
  SIGNAL_REGISTRY.LISTENERS.add(listener);
}

/**
 * Unsubscribe from all signals and listen everything.
 * Not intended to be used as core feature, just for some elegant decisions.
 */
export function unsubscribeFromSignals(listener: TSignalListener<any>): void {
  SIGNAL_REGISTRY.LISTENERS.delete(listener);
}
