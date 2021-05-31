import { SCOPE_SYMBOL, SIGNALING_HANDLER_SYMBOL } from "@/dreamstate/core/internals";
import { queryDataAsync } from "@/dreamstate/core/queries/queryDataAsync";
import { queryDataSync } from "@/dreamstate/core/queries/queryDataSync";
import { registerQueryProvider } from "@/dreamstate/core/scoping/queries/registerQueryProvider";
import { unRegisterQueryProvider } from "@/dreamstate/core/scoping/queries/unRegisterQueryProvider";
import { createRegistry, IRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { onMetadataSignalListenerCalled } from "@/dreamstate/core/scoping/signals/onMetadataSignalListenerCalled";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { emitSignal } from "@/dreamstate/core/signals/emitSignal";
import { processComputed } from "@/dreamstate/core/storing/processComputed";
import { throwAfterDisposal } from "@/dreamstate/core/utils/throwAfterDisposal";
import {
  IBaseSignal,
  IContextManagerConstructor,
  IOptionalQueryRequest,
  TAnyContextManagerConstructor,
  TAnyObject,
  TCallable,
  TQueryListener,
  TQueryResponse,
  TQueryType,
  TSignalListener,
  TSignalType,
  TUpdateObserver,
  TUpdateSubscriber
} from "@/dreamstate/types";

/**
 * Dreamstate core processing of scope and existing data registry.
 * Initialize scope that handles stores, signaling and queries in a VDOM tree.
 *
 * @returns {IScopeContext} mutable scope with set of methods and registry stores for react VDOM tree
 */
export function initializeScopeContext(): IScopeContext {
  const registry: IRegistry = createRegistry();
  const {
    SIGNAL_LISTENERS_REGISTRY, CONTEXT_STATES_REGISTRY, CONTEXT_OBSERVERS_REGISTRY, QUERY_PROVIDERS_REGISTRY,
    CONTEXT_SERVICES_REFERENCES, CONTEXT_INSTANCES_REGISTRY, CONTEXT_SUBSCRIBERS_REGISTRY, CONTEXT_SERVICES_ACTIVATED
  } = registry;

  const scope: IScopeContext = ({
    INTERNAL: {
      REGISTRY: registry,
      registerService<T>(ManagerClass: TAnyContextManagerConstructor, initialState: T): void {
        // Only if registry is empty -> create new instance, remember its context and save it to registry.
        if (!CONTEXT_INSTANCES_REGISTRY.has(ManagerClass)) {
          const instance: InstanceType<TAnyContextManagerConstructor> = new ManagerClass(initialState);

          // todo: Add checkContext method call for deb bundle with warnings for initial state nesting.
          processComputed((instance as ContextManager<any>).context);

          instance[SCOPE_SYMBOL] = scope;
          instance[SIGNALING_HANDLER_SYMBOL] = onMetadataSignalListenerCalled.bind(instance);

          CONTEXT_SERVICES_ACTIVATED.add(ManagerClass);
          CONTEXT_STATES_REGISTRY.set(ManagerClass, (instance as ContextManager).context);
          CONTEXT_SERVICES_REFERENCES.set(ManagerClass, 0);

          CONTEXT_OBSERVERS_REGISTRY.set(ManagerClass, new Set());
          CONTEXT_SUBSCRIBERS_REGISTRY.set(ManagerClass, new Set());

          SIGNAL_LISTENERS_REGISTRY.add(instance[SIGNALING_HANDLER_SYMBOL]);
          CONTEXT_INSTANCES_REGISTRY.set(ManagerClass, instance);
        }
      },
      unRegisterService(ManagerClass: TAnyContextManagerConstructor): void {
        if (CONTEXT_INSTANCES_REGISTRY.has(ManagerClass)) {
          const instance: ContextManager<any> = CONTEXT_INSTANCES_REGISTRY.get(ManagerClass) as ContextManager<any>;

          instance["emitSignal"] = throwAfterDisposal;
          instance["queryDataSync"] = throwAfterDisposal;
          instance["queryDataAsync"] = throwAfterDisposal;

          /**
           * todo: setContext updating replacement with warnings later.
           */

          SIGNAL_LISTENERS_REGISTRY.delete(instance[SIGNALING_HANDLER_SYMBOL]);
        }

        CONTEXT_SERVICES_ACTIVATED.delete(ManagerClass);
        CONTEXT_INSTANCES_REGISTRY.delete(ManagerClass);
        CONTEXT_STATES_REGISTRY.delete(ManagerClass);

        /**
         * Observers and subscribers should not be affected by un-registering.
         */
      },
      addServiceObserver(ManagerClass: TAnyContextManagerConstructor, observer: TUpdateObserver): void {
        CONTEXT_OBSERVERS_REGISTRY.get(ManagerClass)!.add(observer);
      },
      removeServiceObserver(ManagerClass: TAnyContextManagerConstructor, observer: TUpdateObserver): void {
        CONTEXT_OBSERVERS_REGISTRY.get(ManagerClass)!.delete(observer);
      },
      incrementServiceObserving(ManagerClass: TAnyContextManagerConstructor): void {
        const referencesCount: number = CONTEXT_SERVICES_REFERENCES.get(ManagerClass)! + 1;

        CONTEXT_SERVICES_REFERENCES.set(ManagerClass, referencesCount);

        if (referencesCount === 1) {
          CONTEXT_INSTANCES_REGISTRY.get(ManagerClass)!["onProvisionStarted"]();
        }
      },
      decrementServiceObserving(ManagerClass: TAnyContextManagerConstructor): void {
        const referencesCount: number = CONTEXT_SERVICES_REFERENCES.get(ManagerClass)! - 1;

        CONTEXT_SERVICES_REFERENCES.set(ManagerClass, referencesCount);

        if (referencesCount === 0) {
          CONTEXT_INSTANCES_REGISTRY.get(ManagerClass)!["onProvisionEnded"]();
          this.unRegisterService(ManagerClass);
        }
      },
      notifyObservers<T>(manager: ContextManager<T>): void {
        const nextContext: T = manager.context;

        CONTEXT_STATES_REGISTRY.set(manager.constructor as TAnyContextManagerConstructor, nextContext);

        /**
         * Update observers of context manager (react context providers).
         */
        CONTEXT_OBSERVERS_REGISTRY.get(manager.constructor as TAnyContextManagerConstructor)!
          .forEach(function(it: TUpdateObserver) {
            it();
          });
        /**
         * Update subscribers of context manager.
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
        ManagerClass: D,
        subscriber: TUpdateSubscriber<T>
      ): TCallable {
        if (!(ManagerClass.prototype instanceof ContextManager)) {
          throw new TypeError("Cannot subscribe to class that does not extend ContextManager.");
        }

        CONTEXT_SUBSCRIBERS_REGISTRY.get(ManagerClass)!.add(subscriber);

        return function(): void {
          CONTEXT_SUBSCRIBERS_REGISTRY.get(ManagerClass)!.delete(subscriber);
        };
      },
      unsubscribeFromManager<
        T extends TAnyObject,
        D extends IContextManagerConstructor<any, T>
        >(
        ManagerClass: D,
        subscriber: TUpdateSubscriber<T>
      ): void {
        if (!(ManagerClass.prototype instanceof ContextManager)) {
          throw new TypeError("Cannot unsubscribe from class that does not extend ContextManager.");
        }

        registry.CONTEXT_SUBSCRIBERS_REGISTRY.get(ManagerClass)!.delete(subscriber);
      }
    },
    emitSignal<D = undefined, T extends TSignalType = TSignalType>(
      base: IBaseSignal<T, D>,
      emitter: TAnyContextManagerConstructor | null = null
    ): void {
      return emitSignal(base, emitter, registry);
    },
    subscribeToSignals<T extends TSignalType, D = undefined>(
      listener: TSignalListener<T, D>
    ): TCallable {
      if (typeof listener !== "function") {
        throw new Error(`Signal listener must be function, '${typeof listener}' provided.`);
      }

      SIGNAL_LISTENERS_REGISTRY.add(listener);

      return function(): void {
        SIGNAL_LISTENERS_REGISTRY.delete(listener);
      };
    },
    unsubscribeFromSignals<T extends TSignalType, D = undefined>(
      listener: TSignalListener<T, D>
    ): void {
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
      D extends any,
      T extends TQueryType,
      Q extends IOptionalQueryRequest<D, T>
      >(
      query: Q
    ): TQueryResponse<any, T> {
      return queryDataSync<any, D, T, Q>(query, registry)!;
    },
    queryDataAsync<
      D extends any,
      T extends TQueryType,
      Q extends IOptionalQueryRequest<D, T>
    >(
      queryRequest: Q
    ): Promise<TQueryResponse<any, T>> {
      return queryDataAsync<any, D, T, Q>(queryRequest, registry) as Promise<TQueryResponse<any, T>>;
    }
  }
  );

  return scope;
}
