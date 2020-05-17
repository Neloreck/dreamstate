## TODO:

### Utils
- createAsync as loadable copy with stored promise or extended createLoadable
- async code execution utils like takeLatest/takeLeading etc? [createAsync]

### Testing
- test useContextWithMemo properly
- more exotic cases
- review tests, simplify and cover more cases 

### Build
- remove env building and double config for cjs and esm
- wiki builder?
- debug extension?
- test dev assistance with logs and warnings for separate bundles

### Lib
- Think about actions/state separation. [HoCs do not allow to do so]
- Scoping for signals and queries?
- query subscription util?

### Docs
- Docs update
- Simple examples of library usage
- Benchmarks

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
