# <a href='https://www.npmjs.com/package/dreamstate'> 🎸 dreamstate </a>

[![npm version](https://img.shields.io/npm/v/dreamstate.svg?style=flat-square)](https://www.npmjs.com/package/dreamstate)
[![language-ts](https://img.shields.io/badge/language-typescript%3A%20100%25-blue.svg?style=flat)](https://github.com/Neloreck/redux-cbd/search?l=typescript)
<br/>
[![start with wiki](https://img.shields.io/badge/docs-wiki-blue.svg?style=flat)](https://github.com/Neloreck/dreamstate/wiki)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/Neloreck/redux-cbd/blob/master/LICENSE)
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

## Usage
  - todo

## [Documentation](https://github.com/Neloreck/dreamstate/wiki/Home)

#### [Services](https://github.com/Neloreck/dreamstate/wiki/services)
- [ContextService](https://github.com/Neloreck/dreamstate/wiki/ContextService)
- [ContextManager](https://github.com/Neloreck/dreamstate/wiki/ContextManager)
- [getCurrent](https://github.com/Neloreck/dreamstate/wiki/getCurrent)
- [getCurrentContext](https://github.com/Neloreck/dreamstate/wiki/getCurrentContext)


#### [Provision](https://github.com/Neloreck/dreamstate/wiki/provision)
- [createProvider](https://github.com/Neloreck/dreamstate/wiki/createProvider)
- [@Provide](https://github.com/Neloreck/dreamstate/wiki/@Provide)
- [withProvision](https://github.com/Neloreck/dreamstate/wiki/withProvision)

#### [Consumption](https://github.com/Neloreck/dreamstate/wiki/consumption)
- [useManager](https://github.com/Neloreck/dreamstate/wiki/useManager)
- [@Consume](https://github.com/Neloreck/dreamstate/wiki/@Consume)
- [withConsumption](https://github.com/Neloreck/dreamstate/wiki/withConsumption)

#### [Signals](https://github.com/Neloreck/dreamstate/wiki/signals)
- [emitSignal](https://github.com/Neloreck/dreamstate/wiki/emitSignal)
- [subscribeToSignals](https://github.com/Neloreck/dreamstate/wiki/subscribeToSignals)
- [unsubscribeFromSignals](https://github.com/Neloreck/dreamstate/wiki/unsubscribeFromSignals)
- [@OnSignal](https://github.com/Neloreck/dreamstate/wiki/@OnSignal)
- [useSignal](https://github.com/Neloreck/dreamstate/wiki/useSignal)

#### [Queries](https://github.com/Neloreck/dreamstate/wiki/queries)
- [@OnQuery](https://github.com/Neloreck/dreamstate/wiki/@OnQuery)
- [queryData](https://github.com/Neloreck/dreamstate/wiki/queryData)

#### [Utils](https://github.com/Neloreck/dreamstate/wiki/utils)
- [@Bind](https://github.com/Neloreck/dreamstate/wiki/@Bind)
- [createLoadable](https://github.com/Neloreck/dreamstate/wiki/createLoadable)
- [createNested](https://github.com/Neloreck/dreamstate/wiki/createMutable)
- [createComputed](https://github.com/Neloreck/dreamstate/wiki/createComputed)
- [createSetter](https://github.com/Neloreck/dreamstate/wiki/createSetter)

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
