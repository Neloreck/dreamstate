import {
  ISignal,
  ISignalEvent,
  MethodDescriptor,
  TAnyContextManagerConstructor,
  TSignalListener,
  TSignalType
} from "./types";
import { EMPTY_ARR, IDENTIFIER_KEY, CONTEXT_MANAGERS_SIGNAL_LISTENERS_REGISTRY, SIGNAL_LISTENERS } from "./internals";
import { useEffect } from "react";
import { ContextManager } from "./management";
import { log } from "../macroses/log.macro";

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

  SIGNAL_LISTENERS.forEach(function (it: TSignalListener<D, T>) {
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
  log.info("Subscribe to signals api:", SIGNAL_LISTENERS.size + 1);

  SIGNAL_LISTENERS.add(listener);
}

/**
 * Unsubscribe from all signals and listen everything.
 * Not intended to be used as core feature, just for some elegant decisions.
 */
export function unsubscribeFromSignals(listener: TSignalListener<TSignalType, any>): void {
  log.info("Unsubscribe from signals api:", SIGNAL_LISTENERS.size - 1);

  SIGNAL_LISTENERS.delete(listener);
}

/**
 * Listen signal and call related metadata listeners of this manager.
 */
export function onMetadataListenerCalled<D = undefined, T extends TSignalType = TSignalType>(
  this: ContextManager<any>,
  signal: ISignalEvent<D, T>
): void {
  /**
   * Ignore own signals.
   */
  if (signal.emitter !== this) {
    log.info("Calling metadata signal api listener:", this.constructor.name);

    for (
      const [ method, selector ] of
      CONTEXT_MANAGERS_SIGNAL_LISTENERS_REGISTRY[(this.constructor as TAnyContextManagerConstructor)[IDENTIFIER_KEY]]
    ) {
      if (selector(signal.type)) {
        log.info("Found signal listener:", signal.type, this.constructor.name, method);
        (this as any)[method](signal);
      }
    }
  }
}

/**
 * Write signal filter and bound method to class metadata.
 */
export function rememberMethodSignal(
  signal: Array<TSignalType> | TSignalType,
  method: string | symbol,
  managerConstructor: TAnyContextManagerConstructor
): void {
  const selector = Array.isArray(signal)
    ? (type: TSignalType) => signal.includes(type)
    : (type: TSignalType) => type === signal;

  log.info("Signal metadata written for context manager:", managerConstructor.name, signal, method);

  CONTEXT_MANAGERS_SIGNAL_LISTENERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]].push([ method, selector ]);
}

export function OnSignal(signal: Array<TSignalType> | TSignalType): MethodDecorator {
  if (typeof signal !== "string" && !Array.isArray(signal)) {
    throw new Error("Signal decorator expects exact signal type string or array of signal type strings.");
  }

  return function (
    prototypeOrDescriptor: object,
    method: string | symbol
  ) {
    if (prototypeOrDescriptor && method) {
      rememberMethodSignal(signal, method, prototypeOrDescriptor.constructor as TAnyContextManagerConstructor);

      return prototypeOrDescriptor;
    } else {
      if ((prototypeOrDescriptor as MethodDescriptor).kind !== "method") {
        throw new TypeError("Only methods can be decorated with Signal decorator.");
      }

      (prototypeOrDescriptor as MethodDescriptor).finisher = function (targetClass: any) {
        rememberMethodSignal(signal, (prototypeOrDescriptor as MethodDescriptor).key as string, targetClass);
      };

      return prototypeOrDescriptor;
    }
  };
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
