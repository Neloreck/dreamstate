import { ISignalEvent } from "@Lib/types";

export function cancelSignal(this: ISignalEvent) {
  this.canceled = true;
}
