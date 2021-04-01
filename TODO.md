## TODO:

### Testing
  - test useContextWithMemo properly
  - more exotic cases

### Build
  - test dev assistance with logs and warnings for separate bundles
  
### Extension
  - ???

### Lib
  - Store schema registry/creating and validation when initializing context managers?
  - Scoping for signals and queries?
  - check preact
  - assistance messages when consuming, but tree is not provided
  - Scope component or something like it for query/signals scoping

##### Utils
  - createAsync as loadable copy with stored promise or extended createLoadable
  - async code execution utils like takeLatest/takeLeading etc? [createAsync]

### Docs
- Docs update
- Simple examples of library usage

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
  - [-] queryData
  - [-] createComputed
