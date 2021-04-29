## TODO:

### Testing
  - test useContextWithMemo properly
  - more exotic cases

### Build
  - test dev assistance with logs and warnings for separate bundles

### Lib
  - Store schema registry/creating and validation when initializing context managers?
  - Scoping for signals and queries?
  - check preact
  - assistance messages when consuming, but tree is not provided
  - Scope component or something like it for query/signals scoping
  - Optimize queries code
  - Deprecate multiple queries support?
  - Do not send signals/queries from disposed services
  - Add some check for services? (check instance, not service class)

##### Utils
  - createAsync as loadable copy with stored promise or extended createLoadable
  - async code execution utils like takeLatest/takeLeading etc? [createAsync]

### Docs
- Docs update
- Simple examples of library usage

##### docs FAQ cover cases:
  - beforeUpdate for computed values?
