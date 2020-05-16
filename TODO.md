## future:

- createAsync as loadable copy with stored promise or extended createLoadable
- test useContextWithMemo properly
- more exotic cases
- conditional esm export?

- Docs update
- Simple examples of library usage
- Benchmarks

- Think about actions/state separation. [HoCs do not allow to do so]
- Better dev assistance with logs and warnings for development bundle. [ESM support?]
- Async code execution utils like takeLatest/takeLeading etc? [createAsync]

?) Scoping and separated registry?

## docs state:
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
