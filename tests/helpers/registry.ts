import { registerWorker, unRegisterWorker } from "@Lib/registry";
import { TDreamstateWorker } from "@Lib/types";
import { CONTEXT_WORKERS_REGISTRY } from "@Lib/internals";

export function registerWorkerClass<T extends TDreamstateWorker>(workerClass: T): InstanceType<T> {
  registerWorker(workerClass);

  return CONTEXT_WORKERS_REGISTRY.get(workerClass) as InstanceType<T>;
}

export function unRegisterWorkerClass<T extends TDreamstateWorker>(
  workerClass: T,
  forceUnregister: boolean = false
): void {
  unRegisterWorker(workerClass, forceUnregister);
}
