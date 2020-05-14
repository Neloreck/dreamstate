import { ISignalEvent } from "@Lib/core/types";

export function cancelSignal(this: ISignalEvent) {
  this.canceled = true;
}
