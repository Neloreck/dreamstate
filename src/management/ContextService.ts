import {
  IOptionalQueryRequest,
  IQueryRequest,
  ISignal,
  TDreamstateService,
  TQueryType,
  TSignalType
} from "../types";
import { emitSignal } from "../signals/emitSignal";
import { queryData } from "../queries/queryData";

import { debug } from "../../build/macroses/debug.macro";

export abstract class ContextService {

  /**
   * Should dreamstate destroy store instance after observers removal or preserve it for application lifespan.
   * Singleton objects will never be destroyed once created.
   * Non-singleton objects are destroyed if all observers are removed.
   */
  protected static IS_SINGLE: boolean = false;

  /**
   * Lifecycle.
   * First provider was injected into DOM.
   */
  protected onProvisionStarted(): void {}

  /**
   * Lifecycle.
   * Last provider was removed from DOM.
   */
  protected onProvisionEnded(): void {}

  /**
   * Emit signal for other managers and subscribers.
   */
  protected emitSignal<D = undefined, T extends TSignalType = TSignalType>(baseSignal: ISignal<D, T>): void {
    debug.info("Context manager emitting signal:", this.constructor.name, baseSignal);

    emitSignal(baseSignal, this.constructor as TDreamstateService);
  }

  /**
   * Send context query to retrieve data from @OnQuery method with required types.
   */
  protected queryData<
    R extends any,
    D extends any,
    T extends TQueryType,
    Q extends IOptionalQueryRequest<D, T> | Array<IOptionalQueryRequest>
    >(
    queryRequest: Q
  ) {
    return queryData<R, D, T, Q>(queryRequest);
  }

}
