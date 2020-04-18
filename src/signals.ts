import { MethodDescriptor, TAnyContextManagerConstructor, TSignalListener, TSignalType } from "./types";
import { ContextManager } from "./ContextManager";
import { SIGNAL_LISTENER_LIST_KEY } from "./internals";

export const SIGNAL_REGISTRY: {
  LISTENERS: Set<TSignalListener<any>>;
} = {
  LISTENERS: new Set()
};

export function emitSignal<T>(
  type: TSignalType,
  data: T | undefined,
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

export function rememberMethodSignal(
  signal: Array<TSignalType> | TSignalType,
  method: string,
  managerConstructor: TAnyContextManagerConstructor
): void {
  const selector = Array.isArray(signal)
    ? (type: TSignalType) => signal.includes(type)
    : (type: TSignalType) => type === signal;

  managerConstructor[SIGNAL_LISTENER_LIST_KEY].push([ method, selector ]);
}

export function Signal(signal: Array<TSignalType> | TSignalType) {
  if (typeof signal !== "string" && !Array.isArray(signal)) {
    throw new Error("Signal decorator expects exact signal type string or array of signal type strings.");
  }

  return function (
    prototypeOrDescriptor: TAnyContextManagerConstructor["prototype"] | MethodDescriptor,
    method: string
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
