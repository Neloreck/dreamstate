## 3.0.0 (todo)
  * Tests added, stricter check of library for production builds
  * Included UMD, CJS and ESM bundles into library
  * Tree shaking introduced
  * Some benchmark tests introduced
  * Signals API added
    * OnSignal decorator added
    * useSignals hook added
    * unsubscribeFromSignals method added
    * subscribeToSignals method added 
    * emitSignal  method added
    * ContextManager::emitSignal method added
  * Query API added
    * OnQuery decorator added
    * ContextManager::sendQuery method added
  * getCurrentContext method added
  * getCurrentManager method added
  * createSetter method added
  * createMutable method added with related type
  * subscribeToManager method added
  * unsubscribeFromManager method added
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