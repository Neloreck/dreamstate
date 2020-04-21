import { registerManager } from "../../src/registry";
import { IContextManagerConstructor } from "../../src/types";
import { IDENTIFIER_KEY, CONTEXT_MANAGERS_REGISTRY } from "../../src/internals";
import { ContextManager } from "../../src/management";

export function registerManagerClass<T extends IContextManagerConstructor<any>>(managerClass: T): InstanceType<T> {
  registerManager(managerClass);

  const instance: ContextManager<any> = CONTEXT_MANAGERS_REGISTRY[managerClass[IDENTIFIER_KEY]];

  if (!instance) {
    throw new Error("Could not register context manager instance.");
  }

  return instance as InstanceType<T>;
}

