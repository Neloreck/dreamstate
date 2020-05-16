## 3.0.2 (*/*/2020)
  * Better typing - d.ts files will be bundled in a few files instead of whole project tree re-exporting
  * Better package building - no garbage inside library dist
  * Services now listen own signals and queries, but can be filtered manually

## 3.0.1 (5/12/2020)
  * Arrays as queryData method parameters for multiple queries fetching
  * Core update:
    * ContextWorker -> ContextService to reduce confusion with workers and responsibility scope
  * Test utils update:
    * registerWorker -> registerService
    * unRegisterWorker -> unRegisterService
    * getWorkerObserversCount -> getServiceObserversCount
    * isWorkerProvided -> isServiceProvided
    * addManagerObserver -> addServiceObserver
    * removeManagerObserver -> removeServiceObserver
  * Minor implementation fixes - shorter code samples/simplified call checks.

## 3.0.0 (5/9/2020)
  * Tests added, stricter check of library for production builds
  * Included CJS and ESM bundles into library
  * Tree shaking
  * Added "dreamstate/test-utils" for lib testing
  * Signals API added
    * OnSignal decorator added
    * useSignals hook added
    * unsubscribeFromSignals method added
    * subscribeToSignals method added 
    * emitSignal  method added
    * ContextManager::emitSignal method added
  * Query API added
    * OnQuery decorator added
    * ContextManager::queryData method added
  * ContextWorker added
    * Exposed base abstract class for signals and queries observing with provision lifecycle
  * getCurrentContext method added
  * getCurrent method added
  * createSetter method added
  * createMutable method added with related type
  * ContextManager related react context is named same as manager class with DS. prefix
  * ContextManager::REACT_CONTEXT field added
  * ContextManager::IS_SINGLE field added for singleton instances
  * removed ContextManager::static::current method
  * removed ContextManager::static::currentContext method
  * removed ContextManager::static::getSetter method
  * removed ContextManager::static::getContextType method
  * removed asInitial method from Loadable
  * added optional parameters for createLoadable constructor (value, isLoading, error)
  * shared methods for all loadable values
  * shallow check will apply only to Mutable or Loadable values inside context (not all objects)
  * useManager now has optional second parameter for dependencies check
  * exported types are not prefixed with T or I now
  * removed odd REGISTRY object for global scope
  * cleaned up base ContextManagerClass
  * shared logic for decorators implementation
  * added check for base class, ID and REACT_TYPE references will throw error now
  * better @Consume performance, shouldUpdate checks for selectors
  * @Provide and @Consume now require array parameter, not variadic parameters
  * @Provide and @Consume now correctly validate input parameters
  * @Bind decorator does not allow direct property re-writing on runtime now
  * @Bind decorator still can be modified with Object.defineProperty for testing and 'special' cases
