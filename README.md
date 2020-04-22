# <a href='https://www.npmjs.com/package/dreamstate'> 🗻 dreamstate </a>

[![npm version](https://img.shields.io/npm/v/dreamstate.svg?style=flat-square)](https://www.npmjs.com/package/dreamstate)
[![language-ts](https://img.shields.io/badge/language-typescript%3A%20100%25-blue.svg?style=flat)](https://github.com/Neloreck/redux-cbd/search?l=typescript)<br/>
[![start with wiki](https://img.shields.io/badge/docs-wiki-blue.svg?style=flat)](https://github.com/Neloreck/dreamstate/wiki)
                      [![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/Neloreck/redux-cbd/blob/master/LICENSE)
<br/>
[![npm downloads](https://img.shields.io/npm/dt/dreamstate.svg?style=flat-square)](https://www.npmjs.com/package/dreamstate)

<hr/>

Simple and small class based storage for react. <br/>
React API with common observer pattern and nothing more.
<br/> <br/>
Library allows you to create shared context stores for your application without spaghetti-coded providers and simplifies cases when your contexts should reference each other. <br/>
It includes react-like lifecycle, lazy management of memory allocation, global signaling and queries  between store instances. <br/>

<hr/>

 - [x] Tree shaking
 - [x] Fast 
 - [x] Simple 
 - [x] Compact lib
 - [x] Strictly typed
 - [x] No boilerplate code
 - [x] Lazy memory management
 - [x] Easy to test [testing utils in nearest future]


## Installation

- `npm install --save dreamstate`

## Docs

  ##### Management [[ABOUT](https://github.com/Neloreck/dreamstate/wiki/management)]

  - [ContextManager](https://github.com/Neloreck/dreamstate/wiki/ContextManager)
  - [getCurrentManager](https://github.com/Neloreck/dreamstate/wiki/getCurrentManager)
  - [getCurrentContext](https://github.com/Neloreck/dreamstate/wiki/getCurrentContext)
  - [subscribeToManager](https://github.com/Neloreck/dreamstate/wiki/subscribeToManager)
  - [unsubscribeFromManager](https://github.com/Neloreck/dreamstate/wiki/unsubscribeFromManager)

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

## Documentation:

Repository [wiki](https://github.com/Neloreck/dreamstate/wiki) includes docs and samples. <br/>

## Proposals and contribution:

  Feel free to contibute or mail me with questions/proposals/issues (Neloreck@gmail.com). <br/>

## Licence

MIT
