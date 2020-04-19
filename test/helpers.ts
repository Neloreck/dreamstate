import { registerManager, CONTEXT_MANAGERS_REGISTRY } from "../src/registry";
import { IContextManagerConstructor } from "../src/types";
import { IDENTIFIER_KEY } from "../src/internals";
import { ContextManager } from "../src/management";

export function nextAsyncQuery(): Promise<void> {
  return new Promise((resolve: () => void) => setTimeout(resolve));
}

export function forMillis(milliseconds: number): Promise<void> {
  return new Promise((resolve: () => void) => setTimeout(resolve, milliseconds));
}

export function registerManagerInstance<T extends IContextManagerConstructor<any>>(managerClass: T): InstanceType<T> {
  registerManager(managerClass);

  const instance: ContextManager<any> = CONTEXT_MANAGERS_REGISTRY[managerClass[IDENTIFIER_KEY]];

  if (!instance) {
    throw new Error("Could not register context manager instance.");
  }

  return instance as InstanceType<T>;
}

