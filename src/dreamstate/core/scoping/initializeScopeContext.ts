import { ContextManager } from "@/dreamstate";
import { SCOPE_SYMBOL, SIGNALING_HANDLER_SYMBOL } from "@/dreamstate/core/internals";
import { queryDataAsync } from "@/dreamstate/core/queries/queryDataAsync";
import { queryDataSync } from "@/dreamstate/core/queries/queryDataSync";
import { createRegistry, IRegistry } from "@/dreamstate/core/registry/createRegistry";
import { registerQueryProvider } from "@/dreamstate/core/scoping/queries/registerQueryProvider";
import { unRegisterQueryProvider } from "@/dreamstate/core/scoping/queries/unRegisterQueryProvider";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { onMetadataSignalListenerCalled } from "@/dreamstate/core/scoping/signals/onMetadataSignalListenerCalled";
import { emitSignal } from "@/dreamstate/core/signals/emitSignal";
import { processComputed } from "@/dreamstate/core/storing/processComputed";
import {
  IBaseSignal, IContextManagerConstructor, IOptionalQueryRequest, TAnyContextManagerConstructor, TAnyObject,
  TCallable,
  TQueryListener, TQueryResponse,
  TQueryType,
  TSignalListener,
  TSignalType, TUpdateObserver, TUpdateSubscriber
} from "@/dreamstate/types";

function throwAfterDisposal(): never {
  throw new Error("Disposed context are not supposed to access signaling scope.");
}

/**
 * Initialize scope that handles stores, signaling and queries in a tree.
 * todo: Objects instead of weak maps since scope is controlled by a local renderer.
 */
export function initializeScopeContext(): IScopeContext {
  const registry: IRegistry = createRegistry();
  const {
    SIGNAL_LISTENERS_REGISTRY, CONTEXT_STATES_REGISTRY, CONTEXT_OBSERVERS_REGISTRY, QUERY_PROVIDERS_REGISTRY,
    CONTEXT_SERVICES_REFERENCES, CONTEXT_SERVICES_REGISTRY, CONTEXT_SUBSCRIBERS_REGISTRY, CONTEXT_SERVICES_ACTIVATED
  } = registry;

  return ({
    REGISTRY: registry,
    registerService<T>(Service: TAnyContextManagerConstructor, initialState: T): void {
      // Only if registry is empty -> create new instance, remember its context and save it to registry.
      if (!CONTEXT_SERVICES_REGISTRY.has(Service)) {
        const instance: InstanceType<TAnyContextManagerConstructor> = new Service(initialState);

        // todo: Add checkContext method call for deb bundle with warnings for initial state nesting.
        processComputed((instance as ContextManager<any>).context);

        // todo: add query handling

        instance[SCOPE_SYMBOL] = this;
        instance[SIGNALING_HANDLER_SYMBOL] = onMetadataSignalListenerCalled.bind(this);

        CONTEXT_SERVICES_ACTIVATED.add(Service);
        CONTEXT_STATES_REGISTRY.set(Service, (instance as ContextManager).context);
        CONTEXT_SERVICES_REFERENCES.set(Service, 0);
        CONTEXT_OBSERVERS_REGISTRY.set(Service, new Set());
        // Subscribers are not always sync, should not block their un-sub later.

        SIGNAL_LISTENERS_REGISTRY.add(instance[SIGNALING_HANDLER_SYMBOL]);

        CONTEXT_SERVICES_REGISTRY.set(Service, instance);
      }
    },
    unRegisterService(Service: TAnyContextManagerConstructor): void {
      if (CONTEXT_SERVICES_REGISTRY.has(Service)) {
        const instance: ContextManager<any> = CONTEXT_SERVICES_REGISTRY.get(Service) as ContextManager<any>;

        instance["emitSignal"] = throwAfterDisposal;
        instance["queryDataSync"] = throwAfterDisposal;
        instance["queryDataAsync"] = throwAfterDisposal;

        SIGNAL_LISTENERS_REGISTRY.delete(instance[SIGNALING_HANDLER_SYMBOL]);
      }

      CONTEXT_SERVICES_ACTIVATED.delete(Service);
      CONTEXT_SERVICES_REGISTRY.delete(Service);
      CONTEXT_STATES_REGISTRY.delete(Service);
      CONTEXT_OBSERVERS_REGISTRY.delete(Service);
    },
    addServiceObserver(Service: TAnyContextManagerConstructor, observer: TUpdateObserver): void {
      CONTEXT_OBSERVERS_REGISTRY.get(Service)!.add(observer);
    },
    removeServiceObserver(Service: TAnyContextManagerConstructor, observer: TUpdateObserver): void {
      CONTEXT_OBSERVERS_REGISTRY.get(Service)!.delete(observer);
    },
    incrementServiceObserving(Service: TAnyContextManagerConstructor): void {
      const referencesCount: number = CONTEXT_SERVICES_REFERENCES.get(Service)! + 1;

      CONTEXT_SERVICES_REFERENCES.set(Service, referencesCount);

      if (referencesCount === 1) {
        CONTEXT_SERVICES_REGISTRY.get(Service)!["onProvisionStarted"]();
      }
    },
    decrementServiceObserving(Service: TAnyContextManagerConstructor): void {
      const referencesCount: number = CONTEXT_SERVICES_REFERENCES.get(Service)! - 1;

      CONTEXT_SERVICES_REFERENCES.set(Service, referencesCount);

      if (referencesCount === 0) {
        CONTEXT_SERVICES_REGISTRY.get(Service)!["onProvisionEnded"]();
        this.unRegisterService(Service);
      }
    },
    notifyObservers<T>(manager: ContextManager<T>): void {
      const nextContext: T = manager.context;

      CONTEXT_STATES_REGISTRY.set(manager.constructor as TAnyContextManagerConstructor, nextContext);
        CONTEXT_OBSERVERS_REGISTRY.get(manager.constructor as TAnyContextManagerConstructor)!
          .forEach(function(it: TUpdateObserver) {
            it();
          });
        /**
         * Update subscribe
         */
        CONTEXT_SUBSCRIBERS_REGISTRY.get(manager.constructor as TAnyContextManagerConstructor)!
          .forEach(function(it: TUpdateSubscriber<T>) {
            it(nextContext);
          });
    },
    subscribeToManager<
      T extends TAnyObject,
      D extends IContextManagerConstructor<any, T, any>
    >(
      Manager: D,
      subscriber: TUpdateSubscriber<T>
    ): TCallable {
      if (!(Manager.prototype instanceof ContextManager)) {
        throw new TypeError("Cannot subscribe to class that does not extend ContextManager.");
      }

      CONTEXT_SUBSCRIBERS_REGISTRY.get(Manager)!.add(subscriber);

      return function() {
        CONTEXT_SUBSCRIBERS_REGISTRY.get(Manager)!.delete(subscriber);
      };
    },
    unsubscribeFromManager<
      T extends TAnyObject,
      D extends IContextManagerConstructor<any, T>
    >(
      Manager: D,
      subscriber: TUpdateSubscriber<T>
    ): void {
      if (!(Manager.prototype instanceof ContextManager)) {
        throw new TypeError("Cannot unsubscribe from class that does not extend ContextManager.");
      }

      registry.CONTEXT_SUBSCRIBERS_REGISTRY.get(Manager)!.delete(subscriber);
    },
    emitSignal<D = undefined, T extends TSignalType = TSignalType>(
      base: IBaseSignal<T, D>,
      emitter: TAnyContextManagerConstructor | null = null
    ): Promise<void> {
      return emitSignal(base, emitter, registry);
    },
    subscribeToSignals(listener: TSignalListener): TCallable {
      if (typeof listener !== "function") {
        throw new Error(`Signal listener must be function, '${typeof listener}' provided.`);
      }

      SIGNAL_LISTENERS_REGISTRY.add(listener);

      return function() {
        SIGNAL_LISTENERS_REGISTRY.delete(listener);
      };
    },
    unsubscribeFromSignals(listener: TSignalListener): void {
      SIGNAL_LISTENERS_REGISTRY.delete(listener);
    },
    registerQueryProvider<T extends TQueryType>(
      queryType: T,
      listener: TQueryListener<T, any>
    ): TCallable {
      return registerQueryProvider(queryType, listener, registry);
    },
    unRegisterQueryProvider<T extends TQueryType>(
      queryType: T,
      listener: TQueryListener<T, any>
    ): void {
      return unRegisterQueryProvider(queryType, listener, registry);
    },
    queryDataSync<
      R,
      D extends any,
      T extends TQueryType,
      Q extends IOptionalQueryRequest<D, T>
      >(
      query: Q
    ): TQueryResponse<R, T> {
      return queryDataSync<R, D, T>(query, registry)!;
    },
    queryDataAsync<
      R,
      D extends any,
      T extends TQueryType,
      Q extends IOptionalQueryRequest<D, T>
    >(
      queryRequest: Q
    ): Promise<TQueryResponse<R, T>> {
      return queryDataAsync<R, D, T>(queryRequest, registry);
    }
  }
  );
}
