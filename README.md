# <a href='https://www.npmjs.com/package/dreamstate'> 🎸 dreamstate </a>

[![npm version](https://img.shields.io/npm/v/dreamstate.svg?style=flat-square)](https://www.npmjs.com/package/dreamstate)
[![language-ts](https://img.shields.io/badge/language-typescript-blue.svg?style=flat)](https://github.com/Neloreck/dreamstate/search?l=typescript)
<br/>
[![start with wiki](https://img.shields.io/badge/docs-wiki-blue.svg?style=flat)](https://github.com/Neloreck/dreamstate/wiki)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/Neloreck/dreamstate/blob/master/LICENSE)
<br/>
[![npm downloads](https://img.shields.io/npm/dt/dreamstate.svg?style=flat-square)](https://www.npmjs.com/package/dreamstate)

<hr/>

Simple data management for react. <br/>
<br/>
Separation of application view and data without spaghetti-coded providers and boilerplate code. <br/>
Library helps to create small stores with react-like lifecycle, lazy management of memory allocation and signaling. <br/>

 - [x] Tree shaking
 - [x] Strictly typed
 - [x] No boilerplate code
 - [x] Lazy memory management
 - [x] Fast 
 - [x] Simple 
 - [x] Testable

## Install
- `npm install --save dreamstate`

## Requirements
- `react >= 16.8.0`

## [Documentation](https://github.com/Neloreck/dreamstate/wiki/Home)

#### [Services](https://github.com/Neloreck/dreamstate/wiki/services)
- [ContextManager](https://github.com/Neloreck/dreamstate/wiki/ContextManager)
- [getCurrent](https://github.com/Neloreck/dreamstate/wiki/getCurrent)
- [getCurrentContext](https://github.com/Neloreck/dreamstate/wiki/getCurrentContext)


#### [Provision](https://github.com/Neloreck/dreamstate/wiki/provision)
- [createProvider](https://github.com/Neloreck/dreamstate/wiki/createProvider)

#### [Consumption](https://github.com/Neloreck/dreamstate/wiki/consumption)
- [useManager](https://github.com/Neloreck/dreamstate/wiki/useManager)

#### [Signals](https://github.com/Neloreck/dreamstate/wiki/signals)
- [emitSignal](https://github.com/Neloreck/dreamstate/wiki/emitSignal)
- [subscribeToSignals](https://github.com/Neloreck/dreamstate/wiki/subscribeToSignals)
- [unsubscribeFromSignals](https://github.com/Neloreck/dreamstate/wiki/unsubscribeFromSignals)
- [@OnSignal](https://github.com/Neloreck/dreamstate/wiki/@OnSignal)
- [useSignals](https://github.com/Neloreck/dreamstate/wiki/useSignals)

#### [Queries](https://github.com/Neloreck/dreamstate/wiki/queries)
- [@OnQuery](https://github.com/Neloreck/dreamstate/wiki/@OnQuery)
- [queryDataAsync](https://github.com/Neloreck/dreamstate/wiki/queryDataAsync)
- [queryDataSync](https://github.com/Neloreck/dreamstate/wiki/queryDataSync)
- [registerQueryProvider](https://github.com/Neloreck/dreamstate/wiki/registerQueryProvider)
- [unRegisterQueryProvider](https://github.com/Neloreck/dreamstate/wiki/unRegisterQueryProvider)

#### [Utils](https://github.com/Neloreck/dreamstate/wiki/utils)
- [@Bind](https://github.com/Neloreck/dreamstate/wiki/@Bind)
- [createLoadable](https://github.com/Neloreck/dreamstate/wiki/createLoadable)
- [createNested](https://github.com/Neloreck/dreamstate/wiki/createMutable)
- [createComputed](https://github.com/Neloreck/dreamstate/wiki/createComputed)
- [createActions](https://github.com/Neloreck/dreamstate/wiki/createActions)

#### [Testing](https://github.com/Neloreck/dreamstate/wiki/testing)
- [registerService](https://github.com/Neloreck/dreamstate/wiki/registerService)
- [unRegisterService](https://github.com/Neloreck/dreamstate/wiki/unRegisterService)
- [isServiceProvided](https://github.com/Neloreck/dreamstate/wiki/isServiceProvided)
- [getServiceObserversCount](https://github.com/Neloreck/dreamstate/wiki/getServiceObserversCount)
- [addServiceObserver](https://github.com/Neloreck/dreamstate/wiki/addServiceObserver)
- [removeServiceObserver](https://github.com/Neloreck/dreamstate/wiki/removeServiceObserver)
- [getReactConsumer](https://github.com/Neloreck/dreamstate/wiki/getReactConsumer)
- [getReactProvider](https://github.com/Neloreck/dreamstate/wiki/getReactProvider)
- [nextAsyncQueue](https://github.com/Neloreck/dreamstate/wiki/nextAsyncQueue)

## Proposals and contribution:
Feel free to open PRs or issues. <br/>

## Licence
MIT
