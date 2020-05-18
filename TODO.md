## TODO:

### Utils
  - createAsync as loadable copy with stored promise or extended createLoadable
  - async code execution utils like takeLatest/takeLeading etc? [createAsync]
  - computed values? [createComputed]

### Testing
  - test useContextWithMemo properly
  - more exotic cases
  - review tests, simplify and cover more cases 
  - test dev and prod bundles

### Build
  - wiki builder?
  - test dev assistance with logs and warnings for separate bundles
  - dev.call macro with conditional calls
  
### Extension
  - ???

### Lib
  - Think about actions/state separation. [HoCs do not allow to do so]
  - Scoping for signals and queries?
  - query subscription util?
  - check preact
  - assistance messages when consuming, but tree is not provided
  - Scope component or something like it for query/signals scoping

### Docs
  - Docs update
  - Simple examples of library usage
  - Benchmarks

##### docs FAQ cover cases:
  - beforeUpdate for computed values?

##### docs state:
  - [+] @Bind
  - [+] @Consume
  - [+] @OnQuery
  - [+] @Provide
  - [+] ContextManager
  - [+] ContextService
  - [+] ContextService
  - [+] createLoadable
  - [+] createProvider
  - [+] getCurrent
  - [+] getCurrentContext
  - [+] useManager
  - [+] withConsumption
  - [+] withProvision
  
  - [-] @OnSignal
  - [-] addManagerObserver
  - [-] consumption
  - [-] createSetter
  - [-] emitSignal
  - [-] FAQ
  - [-] getReactConsumer
  - [-] getReactProvider
  - [-] getServiceObserversCount
  - [-] isServiceProvided
  - [-] nextAsyncQueue
  - [-] provision
  - [-] queries
  - [-] queries
  - [-] registerService
  - [-] removeManagerObserver
  - [-] services
  - [-] signals
  - [-] subscribeToSignals
  - [-] testing
  - [-] unRegisterService
  - [-] unSubscribeFromSignals
  - [-] useSignal
