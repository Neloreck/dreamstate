import { DreamstateError } from "@/dreamstate/core/error/DreamstateError";
import { noop } from "@/dreamstate/core/error/noop";
import { throwAfterDisposal } from "@/dreamstate/core/error/throw";
import {
  QUERY_METADATA_REGISTRY,
  QUERY_METADATA_SYMBOL,
  SCOPE_SYMBOL,
  SIGNAL_METADATA_REGISTRY,
  SIGNAL_METADATA_SYMBOL,
  SIGNALING_HANDLER_SYMBOL,
} from "@/dreamstate/core/internals";
import { ContextManager } from "@/dreamstate/core/management/ContextManager";
import { queryDataAsync } from "@/dreamstate/core/queries/queryDataAsync";
import { queryDataSync } from "@/dreamstate/core/queries/queryDataSync";
import { registerQueryProvider } from "@/dreamstate/core/scoping/queries/registerQueryProvider";
import { unRegisterQueryProvider } from "@/dreamstate/core/scoping/queries/unRegisterQueryProvider";
import { createRegistry, IRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { onMetadataSignalListenerCalled } from "@/dreamstate/core/scoping/signals/onMetadataSignalListenerCalled";
import { emitSignal } from "@/dreamstate/core/signals/emitSignal";
import { processComputed } from "@/dreamstate/core/storing/processComputed";
import { collectProtoChainMetadata } from "@/dreamstate/core/utils/collectProtoChainMetadata";
import {
  EDreamstateErrorCode,
  IBaseSignal,
  IContextManagerConstructor,
  IOptionalQueryRequest,
  ISignalEvent,
  TAnyContextManagerConstructor,
  TAnyObject,
  TAnyValue,
  TCallable,
  TQueryListener,
  TQueryResponse,
  TQueryType,
  TSignalListener,
  TUninitializedValue,
  TUpdateObserver,
  TUpdateSubscriber,
} from "@/dreamstate/types";
import { isFunction } from "@/dreamstate/utils/typechecking";

/**
 * Initializes the core scope context for managing stores, signals, and queries in the VDOM tree.
 * This function sets up the scope that is responsible for handling state and interactions within
 *   the context of React's virtual DOM.
 *
 * @param {IRegistry} [registry] - Optional registry object to initialize.
 * @returns {IScopeContext} Mutable scope with a set of methods and registry stores for the React VDOM tree.
 */
export function createScope(registry: IRegistry = createRegistry()): IScopeContext {
  const {
    SIGNAL_LISTENERS_REGISTRY,
    CONTEXT_STATES_REGISTRY,
    CONTEXT_OBSERVERS_REGISTRY,
    QUERY_PROVIDERS_REGISTRY,
    CONTEXT_SERVICES_REFERENCES,
    CONTEXT_INSTANCES_REGISTRY,
    CONTEXT_SUBSCRIBERS_REGISTRY,
  } = registry;

  const scope: IScopeContext = {
    INTERNAL: {
      REGISTRY: registry,
      registerManager<T, C extends TAnyObject>(
        ManagerClass: TAnyContextManagerConstructor,
        initialState: T,
        initialContext?: C
      ): boolean {
        // Only if registry is empty -> create new instance, remember its context and save it to registry.
        if (!CONTEXT_INSTANCES_REGISTRY.has(ManagerClass)) {
          const instance: InstanceType<TAnyContextManagerConstructor> = new ManagerClass(initialState);

          /*
           * Inject initial context fields if provided for overriding on manager construction.
           */
          if (initialContext) {
            Object.assign(instance.context, initialContext);
          }

          // todo: Add checkContext method call for dev bundle with warnings for initial state nesting.
          processComputed((instance as ContextManager<TAnyValue>).context);

          instance[SCOPE_SYMBOL] = scope;
          instance[SIGNAL_METADATA_SYMBOL] = collectProtoChainMetadata(ManagerClass, SIGNAL_METADATA_REGISTRY);
          instance[QUERY_METADATA_SYMBOL] = collectProtoChainMetadata(ManagerClass, QUERY_METADATA_REGISTRY);
          instance[SIGNALING_HANDLER_SYMBOL] = onMetadataSignalListenerCalled.bind(instance);

          CONTEXT_STATES_REGISTRY.set(ManagerClass, (instance as ContextManager).context);
          CONTEXT_SERVICES_REFERENCES.set(ManagerClass, 0);

          CONTEXT_OBSERVERS_REGISTRY.set(ManagerClass, new Set());

          SIGNAL_LISTENERS_REGISTRY.add(instance[SIGNALING_HANDLER_SYMBOL]);
          CONTEXT_INSTANCES_REGISTRY.set(ManagerClass, instance);

          /*
           * Notify subscribers if they exist.
           * Create new entry if it is needed.
           */
          if (CONTEXT_SUBSCRIBERS_REGISTRY.has(ManagerClass)) {
            CONTEXT_SUBSCRIBERS_REGISTRY.get(ManagerClass)!.forEach(function(it) {
              it(instance.context);
            });
          } else {
            CONTEXT_SUBSCRIBERS_REGISTRY.set(ManagerClass, new Set());
          }

          return true;
        } else {
          return false;
        }
      },
      unRegisterManager(ManagerClass: TAnyContextManagerConstructor): boolean {
        if (CONTEXT_INSTANCES_REGISTRY.has(ManagerClass)) {
          const instance: ContextManager<TAnyValue> = CONTEXT_INSTANCES_REGISTRY.get(
            ManagerClass
          ) as ContextManager<TAnyValue>;

          /*
           * Unset handlers and stop affecting scope after unregister.
           * For external calls throw an exception (queries).
           */
          instance[SCOPE_SYMBOL] = null as TUninitializedValue;

          instance["setContext"] = noop as TUninitializedValue;
          instance["forceUpdate"] = noop as TUninitializedValue;

          /*
           * Most likely code will fail with null pointer in case of warning.
           * Or it will start work in an unexpected way with 'null' check.
           */
          instance["emitSignal"] = throwAfterDisposal as TUninitializedValue;
          instance["queryDataSync"] = throwAfterDisposal as TUninitializedValue;
          instance["queryDataAsync"] = throwAfterDisposal as TUninitializedValue;

          /*
           * Mark instance as disposed to enable internal logic related to lifecycle and async actions/timers.
           */
          instance.IS_DISPOSED = true;

          SIGNAL_LISTENERS_REGISTRY.delete(instance[SIGNALING_HANDLER_SYMBOL]);
          CONTEXT_INSTANCES_REGISTRY.delete(ManagerClass);
          CONTEXT_STATES_REGISTRY.delete(ManagerClass);

          return true;
        } else {
          CONTEXT_INSTANCES_REGISTRY.delete(ManagerClass);
          CONTEXT_STATES_REGISTRY.delete(ManagerClass);

          return false;
        }

        /*
         * Observers and subscribers should not be affected by un-registering.
         */
      },
      addServiceObserver(
        ManagerClass: TAnyContextManagerConstructor,
        observer: TUpdateObserver,
        referencesCount: number = CONTEXT_SERVICES_REFERENCES.get(ManagerClass)! + 1
      ): void {
        CONTEXT_OBSERVERS_REGISTRY.get(ManagerClass)!.add(observer);
        CONTEXT_SERVICES_REFERENCES.set(ManagerClass, referencesCount);

        if (referencesCount === 1) {
          CONTEXT_INSTANCES_REGISTRY.get(ManagerClass)!["onProvisionStarted"]();
        }
      },
      removeServiceObserver(
        ManagerClass: TAnyContextManagerConstructor,
        observer: TUpdateObserver,
        referencesCount: number = CONTEXT_SERVICES_REFERENCES.get(ManagerClass)! - 1
      ): void {
        CONTEXT_OBSERVERS_REGISTRY.get(ManagerClass)!.delete(observer);
        CONTEXT_SERVICES_REFERENCES.set(ManagerClass, referencesCount);

        if (referencesCount === 0) {
          CONTEXT_INSTANCES_REGISTRY.get(ManagerClass)!["onProvisionEnded"]();
          this.unRegisterManager(ManagerClass);
        }
      },
      notifyObservers<T extends TAnyObject>(manager: ContextManager<T>): void {
        const nextContext: T = manager.context;

        CONTEXT_STATES_REGISTRY.set(manager.constructor as TAnyContextManagerConstructor, nextContext);

        /*
         * Update observers of context manager (react context providers).
         */
        CONTEXT_OBSERVERS_REGISTRY.get(manager.constructor as TAnyContextManagerConstructor)!.forEach(function(
          it: TUpdateObserver
        ) {
          it();
        });
        /*
         * Update subscribers of context manager.
         */
        CONTEXT_SUBSCRIBERS_REGISTRY.get(manager.constructor as TAnyContextManagerConstructor)!.forEach(function(
          it: TUpdateSubscriber<T>
        ) {
          it(nextContext);
        });
      },
      subscribeToManager<T extends TAnyObject, D extends IContextManagerConstructor<TAnyValue, T, TAnyValue>>(
        ManagerClass: D,
        subscriber: TUpdateSubscriber<T>
      ): TCallable {
        if (!(ManagerClass.prototype instanceof ContextManager)) {
          throw new DreamstateError(
            EDreamstateErrorCode.TARGET_CONTEXT_MANAGER_EXPECTED,
            `Cannot subscribe to '${ManagerClass?.name}'.`
          );
        }

        CONTEXT_SUBSCRIBERS_REGISTRY.get(ManagerClass)!.add(subscriber);

        return function(): void {
          CONTEXT_SUBSCRIBERS_REGISTRY.get(ManagerClass)!.delete(subscriber);
        };
      },
      unsubscribeFromManager<T extends TAnyObject, D extends IContextManagerConstructor<TAnyValue, T>>(
        ManagerClass: D,
        subscriber: TUpdateSubscriber<T>
      ): void {
        if (!(ManagerClass.prototype instanceof ContextManager)) {
          throw new DreamstateError(
            EDreamstateErrorCode.TARGET_CONTEXT_MANAGER_EXPECTED,
            `Cannot unsubscribe from '${ManagerClass?.name}'.`
          );
        }

        registry.CONTEXT_SUBSCRIBERS_REGISTRY.get(ManagerClass)!.delete(subscriber);
      },
    },
    getContextOf<T extends TAnyObject, D extends IContextManagerConstructor<T>>(manager: D): T {
      const context: T | null = CONTEXT_STATES_REGISTRY.get(manager) as T;

      /*
       * Return new shallow copy of state to prevent modifications.
       * In case of non-existing manager typecasting value as T because it is
       *   rather not expected case to force check all the time.
       */
      if (context) {
        return Object.assign({}, context);
      } else {
        return null as unknown as T;
      }
    },
    getInstanceOf<T extends IContextManagerConstructor>(manager: T): InstanceType<T> {
      return (CONTEXT_INSTANCES_REGISTRY.get(manager) || null) as InstanceType<T>;
    },
    emitSignal<D = undefined>(
      base: IBaseSignal<D>,
      emitter: TAnyContextManagerConstructor | null = null
    ): ISignalEvent<D> {
      return emitSignal(base, emitter, registry);
    },
    subscribeToSignals<D = undefined>(listener: TSignalListener<D>): TCallable {
      if (!isFunction(listener)) {
        throw new DreamstateError(EDreamstateErrorCode.INCORRECT_SIGNAL_LISTENER, typeof listener);
      }

      SIGNAL_LISTENERS_REGISTRY.add(listener);

      return function(): void {
        SIGNAL_LISTENERS_REGISTRY.delete(listener);
      };
    },
    unsubscribeFromSignals<D = undefined>(listener: TSignalListener<D>): void {
      SIGNAL_LISTENERS_REGISTRY.delete(listener);
    },
    registerQueryProvider<T extends TQueryType>(queryType: T, listener: TQueryListener<T, TAnyValue>): TCallable {
      return registerQueryProvider(queryType, listener, registry);
    },
    unRegisterQueryProvider<T extends TQueryType>(queryType: T, listener: TQueryListener<T, TAnyValue>): void {
      return unRegisterQueryProvider(queryType, listener, registry);
    },
    queryDataSync<D, T extends TQueryType, Q extends IOptionalQueryRequest<D, T>>(query: Q): TQueryResponse<TAnyValue> {
      return queryDataSync<TAnyValue, D, T, Q>(query, registry)!;
    },
    queryDataAsync<D, T extends TQueryType, Q extends IOptionalQueryRequest<D, T>>(
      queryRequest: Q
    ): Promise<TQueryResponse<TAnyValue>> {
      return queryDataAsync<TAnyValue, D, T, Q>(queryRequest, registry) as Promise<TQueryResponse<TAnyValue>>;
    },
  };

  return scope;
}
