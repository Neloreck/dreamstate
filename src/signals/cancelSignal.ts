import { ISignalEvent } from "../types";

export function cancelSignal(this: ISignalEvent) {
  this.canceled = true;
}
