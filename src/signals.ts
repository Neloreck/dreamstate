import { useEffect } from "react";

import {
  ISignal,
  ISignalEvent,
  TAnyContextManagerConstructor,
  TSignalListener,
  TSignalType
} from "./types";
import {
  CONTEXT_SIGNAL_METADATA_REGISTRY,
  EMPTY_ARR,
  IDENTIFIER_KEY,
  SIGNAL_LISTENERS_REGISTRY
} from "./internals";
import { ContextManager } from "./management";
import { createMethodDecorator } from "./polyfills/decorate";

import { log } from "./macroses/log.macro";

/**
 * Emit signal and notify all subscribers in async query.
 * If event is cancelled, stop its propagation to next handlers.
 */
export function emitSignal<D = undefined, T extends TSignalType = TSignalType>(
  base: ISignal<D, T>,
  emitter: ContextManager<any> | null = null
): void {
  const signal: ISignalEvent<D, T> = Object.assign(
    base,
    {
      emitter,
      cancel: function (): void {
        (this as ISignalEvent<D, T>).cancelled = true;
      }
    });

  log.info("Signal API emit signal:", base, emitter ? emitter.constructor.name : null);

  SIGNAL_LISTENERS_REGISTRY.forEach(function (it: TSignalListener<D, T>) {
    // Async query.
    setTimeout(function () {
      // todo: Check if cancel will work?
      if (!signal.cancelled) {
        it(signal);
      } else {
        log.info("Signal API ignore cancelled signal:", signal);
      }
    });
  });
}

/**
 * Subscribe to all signals and listen everything.
 * Should be filtered by users like redux does.
 * Not intended to be used as core feature, just for some elegant decisions.
 */
export function subscribeToSignals(listener: TSignalListener<TSignalType, any>): void {
  log.info("Subscribe to signals api:", SIGNAL_LISTENERS_REGISTRY.size + 1);

  SIGNAL_LISTENERS_REGISTRY.add(listener);
}

/**
 * Unsubscribe from all signals and listen everything.
 * Not intended to be used as core feature, just for some elegant decisions.
 */
export function unsubscribeFromSignals(listener: TSignalListener<TSignalType, any>): void {
  log.info("Unsubscribe from signals api:", SIGNAL_LISTENERS_REGISTRY.size - 1);

  SIGNAL_LISTENERS_REGISTRY.delete(listener);
}

/**
 * Listen signal and call related metadata listeners of this manager.
 */
export function onMetadataSignalListenerCalled<D = undefined, T extends TSignalType = TSignalType>(
  this: ContextManager<any>,
  signal: ISignalEvent<D, T>
): void {
  /**
   * Ignore own signals.
   */
  if (signal.emitter !== this) {
    log.info("Calling metadata signal api listener:", this.constructor.name);

    for (
      const [ method, subscribed ] of
      CONTEXT_SIGNAL_METADATA_REGISTRY[(this.constructor as TAnyContextManagerConstructor)[IDENTIFIER_KEY]]
    ) {
      if (Array.isArray(subscribed) ? subscribed.includes(signal.type) : signal.type === subscribed) {
        log.info("Found signal listener:", signal.type, this.constructor.name, method);
        (this as any)[method](signal);
      }
    }
  }
}

/**
 * Write signal filter and bound method to class metadata.
 */
export function OnSignal(signalType: Array<TSignalType> | TSignalType): MethodDecorator {
  return createMethodDecorator<TAnyContextManagerConstructor>(function (
    method: string | symbol,
    managerConstructor: TAnyContextManagerConstructor
  ): void {
    log.info("Signal metadata written for context manager:", managerConstructor.name, signalType, method);

    CONTEXT_SIGNAL_METADATA_REGISTRY[managerConstructor[IDENTIFIER_KEY]].push([ method, signalType ]);
  });
}

/**
 * Hook for signals listening and custom UI handling.
 */
export function useSignal(subscriber: TSignalListener<TSignalType, any>): void {
  useEffect(function () {
    subscribeToSignals(subscriber);
    return function () {
      unsubscribeFromSignals(subscriber);
    };
  }, EMPTY_ARR);
}
