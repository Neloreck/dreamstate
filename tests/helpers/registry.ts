import { registerManager, unRegisterManager } from "../../src/registry";
import { IContextManagerConstructor } from "../../src/types";
import { IDENTIFIER_KEY, CONTEXT_MANAGERS_REGISTRY } from "../../src/internals";

export function registerManagerClass<T extends IContextManagerConstructor<any>>(managerClass: T): InstanceType<T> {
  registerManager(managerClass);

  return CONTEXT_MANAGERS_REGISTRY[managerClass[IDENTIFIER_KEY]] as InstanceType<T>;
}

export function unRegisterManagerClass<T extends IContextManagerConstructor<any>>(
  managerClass: T,
  forceUnregister: boolean = false
): void {
  unRegisterManager(managerClass, forceUnregister);
}
