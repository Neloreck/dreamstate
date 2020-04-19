import { registerManager, CONTEXT_MANAGERS_REGISTRY } from "../../src/lib/registry";
import { IContextManagerConstructor } from "../../src/lib/types";
import { IDENTIFIER_KEY } from "../../src/lib/internals";
import { ContextManager } from "../../src/lib/management";

export function registerManagerClass<T extends IContextManagerConstructor<any>>(managerClass: T): InstanceType<T> {
  registerManager(managerClass);

  const instance: ContextManager<any> = CONTEXT_MANAGERS_REGISTRY[managerClass[IDENTIFIER_KEY]];

  if (!instance) {
    throw new Error("Could not register context manager instance.");
  }

  return instance as InstanceType<T>;
}

