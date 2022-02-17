## 4.3.1 (2/*/2022)

### Changed:

- In memoized 'useManager' calls replaced useLayoutEffect with useEffect to prevent error #185 in some rare cases

## 4.3.0 (2/17/2022)

### Added:

- DreamstateError class for internal errors handling
- DreamstateErrorCode enum added containing all internal error codes from library
- 'getScope' method for context manager instances

### Changed:

- Errors from all methods are wrapped now and contain message and code information

## 4.2.0 (12/9/2021)

### Added:

- mockRegistry test-util added
- mockManagerInitialContext test-util added

### Updated:

- HMR, case when tree was not synced with actual store data when subscribed with simple useContext managers (useManager without memo)
- setContext and forceUpdate methods can be called out of scope. In this case simply modify class and continue working
- Signal/query methods correctly throw exception if called out of scope (created with new or when doing it from constructor)
- Validate signals types for signals decorators and methods
- Validate queries types for query decorators and methods
- Register method now allows overriding default initial context for mocking/testing
- mockScope method now uses config object as first param instead of boolean variable

## 4.1.1 (11/3/2021)

### Added:

- New scope method 'getContextOf' introduced

## 4.1.0 (8/20/2021)

### Added:

- IS_DISPOSED field for ContextManager instances to indicate current state
- General testing utils flow was reviewed, revisited methods for testing and simplified it
- Mock scope provider test util for scope testing
- Mock manager test util for isolated scope mocking
- Mock managers test util for isolated scope mocking

### Updated:

- Do not affect scope after disposing with setContext and forceUpdate methods
- Return signal event from 'emitSignal' manager method
- Warn in console when signal handler fails
- Mocked scope can toggle lifecycle now

## 4.0.0 (7/2/2021)

### Added:

- mockScope test-util added
- mockScopeProvider test-util added
- mockManagerWithScope test-util added

### Removed:

- register/observing methods (test-utils) removed
- getCurrentContext (test-utils) removed
- IS_SINGLE removed in favor of scoped storages without global storing // related to HMR problems and best approach for data management
- ContextService removed in favor of ContextManager
- Provide decorator removed
- Consume decorator removed
- withProvision HoC removed
- withConsumption HoC removed
- before/after update lifecycle methods removed
- useSignals method removed
- queryDataAsync stopped supporting array of queries

### Updated:

- getCurrent moved to test-utils
- queryData renamed to queryDataAsync
- mount/unmount order now matches react components
- signals/queries cannot be sent from disposed context manager class
- global methods/getters moved to scope context
- sync emitSignal calls
- correct inheritance of signals/queries metadata
- less verbose typing for queries and signals events
- lifecycle events made public for easier testing
- more optimized loadable/nested values
- ContextManager supports default state without manual initialization (empty object)

## 3.3.2 (4/11/2021)

- 'partialHotReplacement' parameter for created provider elements that are disabled by default -> allow hot updates and partial reload of context managers
- deprecated multiple queries at once for queryData methods

## 3.3.1 (4/6/2021)

- 'registerQueryProvider' method added
- 'unRegisterQueryProvider' method added
- syncQuery improvements
- types improvements

## 3.3.0 (4/5/2021)

- 'initialState' for context providers while constructing servers before provision
- 'queryDataSync' for sync queries execution without promises
- 'useSignals' now subscribes to provided dependencies and does proper re-subscription in useEffect
- 'createActions' util for actions packing without update checking
- Signal type update without optional data parameter
- Default param value for 'asMerged' method for nested objects
- Better typing/type derivation for Signal/SignalEvent types

## 3.2.0 (3/3/2021)

- Separated provision logic and logic of observing
- Support of hot modules replacement
- Support of sources dynamic changes for observer elements (HMR part)

## 3.1.4 (2/26/2021)

- No looped hooks creation for provider hooks

## 3.1.3 (9/17/2020)

- Added resolving promise as return value for emit signal method/function

## 3.1.1 (9/2/2020)

- Fixed issues with numeric signal types check (0)
- Removed null from default queryData typing - now you should add it manually

## 3.1.0 (8/20/2020)

- Better typing - d.ts files will be bundled in a few files instead of whole project tree re-exporting
- Better package building - no garbage inside library dist
- Services now listen own signals and queries, but can be filtered manually
- Conditional bundles for dev[dev assistance and better errors messaging] and prod[faster and smaller] environment
- queryData method exported for external usage
- createMutable -> createNested renamed to match method usage
- createComputed introduced for computed values selectors

## 3.0.1 (5/12/2020)

- Arrays as queryData method parameters for multiple queries fetching
- Core update:
  - ContextWorker -> ContextService to reduce confusion with workers and responsibility scope
- Test utils update:
  - registerWorker -> registerService
  - unRegisterWorker -> unRegisterService
  - getWorkerObserversCount -> getServiceObserversCount
  - isWorkerProvided -> isServiceProvided
  - addManagerObserver -> addServiceObserver
  - removeManagerObserver -> removeServiceObserver
- Minor implementation fixes - shorter code samples/simplified call checks.

## 3.0.0 (5/9/2020)

- Tests added, stricter check of library for production builds
- Included CJS and ESM bundles into library
- Tree shaking
- Added "dreamstate/test-utils" for lib testing
- Signals API added
  - OnSignal decorator added
  - useSignals hook added
  - unsubscribeFromSignals method added
  - subscribeToSignals method added
  - emitSignal method added
  - ContextManager::emitSignal method added
- Query API added
  - OnQuery decorator added
  - ContextManager::queryData method added
- ContextWorker added
  - Exposed base abstract class for signals and queries observing with provision lifecycle
- getCurrentContext method added
- getCurrent method added
- createSetter method added
- createNested method added with related type
- ContextManager related react context is named same as manager class with DS. prefix
- ContextManager::REACT_CONTEXT field added
- ContextManager::IS_SINGLE field added for singleton instances
- removed ContextManager::static::current method
- removed ContextManager::static::currentContext method
- removed ContextManager::static::getSetter method
- removed ContextManager::static::getContextType method
- removed asInitial method from Loadable
- added optional parameters for createLoadable constructor (value, isLoading, error)
- shared methods for all loadable values
- shallow check will apply only to Mutable or Loadable values inside context (not all objects)
- useManager now has optional second parameter for dependencies check
- exported types are not prefixed with T or I now
- removed odd REGISTRY object for global scope
- cleaned up base ContextManagerClass
- shared logic for decorators implementation
- added check for base class, ID and REACT_TYPE references will throw error now
- better @Consume performance, shouldUpdate checks for selectors
- @Provide and @Consume now require array parameter, not variadic parameters
- @Provide and @Consume now correctly validate input parameters
- @Bind decorator does not allow direct property re-writing on runtime now
- @Bind decorator still can be modified with Object.defineProperty for testing and 'special' cases
