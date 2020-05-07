import {
  IQueryRequest,
  IQueryResponse,
  ISignal,
  TDreamstateWorker,
  TQueryType,
  TSignalType
} from "../types";
import { emitSignal } from "../signals/emitSignal";
import { sendQuery } from "../queries/sendQuery";

import { log } from "../../build/macroses/log.macro";

export abstract class ContextWorker {

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
    log.info("Context manager emitting signal:", this.constructor.name, baseSignal);

    emitSignal(baseSignal, this.constructor as TDreamstateWorker);
  }

  /**
   * Send context query to retrieve data from @OnQuery method with required typex.
   */
  protected sendQuery<R, D = undefined, T extends TQueryType = TQueryType>(queryRequest: {
    type: T;
    data?: D;
  }): Promise<IQueryResponse<R, T> | null> {
    log.info("Context manager sending query:", this.constructor.name, queryRequest);

    return sendQuery(queryRequest as IQueryRequest<D, T>, this.constructor as TDreamstateWorker);
  }

}
