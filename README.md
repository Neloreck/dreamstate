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
Helps to separate application view and data without spaghetti-coded providers and boilerplate code. <br/>
Library gives opportunity to create small stores with react-like lifecycle, lazy management of memory allocation and signaling. <br/>

 - [x] Tree shaking
 - [x] Strictly typed
 - [x] No boilerplate code
 - [x] Lazy memory management
 - [x] Fast 
 - [x] Simple 
 - [x] Testable

## Installation
- `npm install --save dreamstate`

## Requirements
- `react >= 16.8.0`

## [Documentation](https://github.com/Neloreck/dreamstate/wiki/Home)

##### Management [[ABOUT](https://github.com/Neloreck/dreamstate/wiki/management)]
- [ContextWorker](https://github.com/Neloreck/dreamstate/wiki/ContextWorker)
- [ContextManager](https://github.com/Neloreck/dreamstate/wiki/ContextManager)
- [getCurrent](https://github.com/Neloreck/dreamstate/wiki/getCurrent)
- [getCurrentContext](https://github.com/Neloreck/dreamstate/wiki/getCurrentContext)

#### Provision [[ABOUT](https://github.com/Neloreck/dreamstate/wiki/provision)]
- [createProvider](https://github.com/Neloreck/dreamstate/wiki/createProvider)
- [@Provide](https://github.com/Neloreck/dreamstate/wiki/@Provide)
- [withProvision](https://github.com/Neloreck/dreamstate/wiki/withProvision)

#### Consumption [[ABOUT](https://github.com/Neloreck/dreamstate/wiki/consumption)]
- [useManager](https://github.com/Neloreck/dreamstate/wiki/useManager)
- [@Consume](https://github.com/Neloreck/dreamstate/wiki/@Consume)
- [withConsumption](https://github.com/Neloreck/dreamstate/wiki/withConsumption)

#### Signals [[ABOUT](https://github.com/Neloreck/dreamstate/wiki/signals)]
- [emitSignal](https://github.com/Neloreck/dreamstate/wiki/emitSignal)
- [subscribeToSignals](https://github.com/Neloreck/dreamstate/wiki/subscribeToSignals)
- [unsubscribeFromSignals](https://github.com/Neloreck/dreamstate/wiki/unsubscribeFromSignals)
- [@OnSignal](https://github.com/Neloreck/dreamstate/wiki/@OnSignal)
- [useSignal](https://github.com/Neloreck/dreamstate/wiki/useSignal)

#### Queries [[ABOUT](https://github.com/Neloreck/dreamstate/wiki/queries)]
- [@OnQuery](https://github.com/Neloreck/dreamstate/wiki/@OnQuery)

#### Utils [[ABOUT](https://github.com/Neloreck/dreamstate/wiki/utils)]
- [@Bind](https://github.com/Neloreck/dreamstate/wiki/@Bind)
- [createLoadable](https://github.com/Neloreck/dreamstate/wiki/createLoadable)
- [createMutable](https://github.com/Neloreck/dreamstate/wiki/createMutable)
- [createSetter](https://github.com/Neloreck/dreamstate/wiki/createSetter)

#### Testing [[ABOUT](https://github.com/Neloreck/dreamstate/wiki/testing)]
- [registerWorker](https://github.com/Neloreck/dreamstate/wiki/registerWorker)
- [unRegisterWorker](https://github.com/Neloreck/dreamstate/wiki/unRegisterWorker)
- [getWorkerObserversCount](https://github.com/Neloreck/dreamstate/wiki/getWorkerObserversCount)
- [isWorkerProvided](https://github.com/Neloreck/dreamstate/wiki/isWorkerProvided)
- [addManagerObserver](https://github.com/Neloreck/dreamstate/wiki/addManagerObserver)
- [removeManagerObserver](https://github.com/Neloreck/dreamstate/wiki/removeManagerObserver)
- [getReactConsumer](https://github.com/Neloreck/dreamstate/wiki/getReactConsumer)
- [getReactProvider](https://github.com/Neloreck/dreamstate/wiki/getReactProvider)
- [nextAsyncQueue](https://github.com/Neloreck/dreamstate/wiki/nextAsyncQueue)

## Proposals and contribution:
Feel free to open PRs or issues. <br/>

## Licence
MIT
