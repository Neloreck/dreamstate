import {
  IBaseSignal,
  ISignal,
  MethodDescriptor,
  TAnyContextManagerConstructor,
  TSignalListener,
  TSignalType
} from "./types";
import { EMPTY_ARR, SIGNAL_LISTENER_LIST_KEY } from "./internals";
import { useEffect } from "react";
import { ContextManager } from "./management";
import { log } from "../macroses/log.macro";

declare const IS_DEBUG: boolean;

const SIGNAL_LISTENERS: Set<TSignalListener<TSignalType, any>> = new Set();

/**
 * Expose internal signals references for debugging.
 */
if (IS_DEBUG) {
  // @ts-ignore debug-only declaration.
  window.__DREAMSTATE_SIGNAL_REGISTRY__ = {
    SIGNAL_LISTENERS
  };
}

export function emitSignal<T extends TSignalType, D>(
  base: IBaseSignal<T, D>,
  emitter: ContextManager<any> | null = null
): void {
  const signal: ISignal<T, D> = Object.assign(
    base,
    {
      emitter,
      cancelled: false,
      cancel: function (): void {
        this.cancelled = true;
      }
    });

  log.info("Signal API emit signal:", base, emitter ? emitter.constructor.name : null);

  SIGNAL_LISTENERS.forEach(function (it: TSignalListener<T, D>) {
    // Async query.
    setTimeout(function () {
      // todo: Check if cancel will work?
      if (!signal.cancelled) {
        log.info("Signal API process signal:", signal);
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
  log.info("Subscribe to signals api:", listener);

  SIGNAL_LISTENERS.add(listener);
}

/**
 * Unsubscribe from all signals and listen everything.
 * Not intended to be used as core feature, just for some elegant decisions.
 */
export function unsubscribeFromSignals(listener: TSignalListener<TSignalType, any>): void {
  log.info("Unsubscribe from signals api:", listener);

  SIGNAL_LISTENERS.delete(listener);
}

/**
 * Listen signal and call related metadata listeners of this manager.
 */
export function onMetadataListenerCalled<T extends TSignalType, D>(
  this: ContextManager<any>,
  signal: ISignal<T, D>
): void {
  log.info("Calling metadata signal api listener:", this.constructor.name);
  /**
   * Ignore own signals.
   */
  if (signal.emitter !== this) {
    for (
      const [ method, selector ] of (this.constructor as TAnyContextManagerConstructor)[SIGNAL_LISTENER_LIST_KEY]
    ) {
      if (selector(signal.type)) {
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

  managerConstructor[SIGNAL_LISTENER_LIST_KEY].push([ method, selector ]);
}

export function Signal(signal: Array<TSignalType> | TSignalType): MethodDecorator {
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
