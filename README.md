# <a href='https://www.npmjs.com/package/dreamstate'> 🗻 dreamstate </a>

[![npm version](https://img.shields.io/npm/v/dreamstate.svg?style=flat-square)](https://www.npmjs.com/package/dreamstate)
[![language-ts](https://img.shields.io/badge/language-typescript%3A%20100%25-blue.svg?style=flat)](https://github.com/Neloreck/redux-cbd/search?l=typescript)<br/>
[![start with wiki](https://img.shields.io/badge/docs-wiki-blue.svg?style=flat)](https://github.com/Neloreck/dreamstate/wiki)
                      [![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/Neloreck/redux-cbd/blob/master/LICENSE)
<br/>
[![npm downloads](https://img.shields.io/npm/dt/dreamstate.svg?style=flat-square)](https://www.npmjs.com/package/dreamstate)
[![HitCount](http://hits.dwyl.com/neloreck/dreamstate.svg)](http://hits.dwyl.com/neloreck/dreamstate)

<hr/>

The simplest and smallest class based storage for react. <br/>
React API with common observer pattern and nothing more.
<br/> <br/>
Library allows you to create shared context stores for your application without long spaghetti-coded providers and simplifies cases when your contexts should reference each other. <br/>
It includes react-like lifecycle and lazy management of store memory allocation.

<hr/>

## Installation

- `npm install --save dreamstate`

<b>Important:</b>
- Package requires 'react' as peer dependency. Hooks support is currently required.
- Package uses 'expirementalDecorators' features for some helpers. You should configure your project bundler correctly if you want to use decorators api.

<hr/>

## Docs
[[Provide](https://github.com/Neloreck/dreamstate/wiki/@Provide)] - provision decorator. <br/>
[[withProvision](https://github.com/Neloreck/dreamstate/wiki/withProvision)] - provision HOC. <br/>
[[createProvider](https://github.com/Neloreck/dreamstate/wiki/createProvider)] - provision component factory. <br/>
[[Consume](https://github.com/Neloreck/dreamstate/wiki/@Consume)] - consumption decorator. <br/>
[[withConsumption](https://github.com/Neloreck/dreamstate/wiki/withConsumption)] - consumption HOC. <br/>
[[useManager](https://github.com/Neloreck/dreamstate/wiki/useManager)] - consumption hook. <br/>
[[ContextManager](https://github.com/Neloreck/dreamstate/wiki/ContextManager)] - abstract context manager class. <br/>
[[Bind](https://github.com/Neloreck/dreamstate/wiki/@Bind)] - method decorator for binding. <br/>

## Documentation:

Repository [wiki](https://github.com/Neloreck/dreamstate/wiki) includes docs and samples. <br/>

## Full examples

Repository includes example project with commentaries: <a href='https://github.com/Neloreck/dreamstate/tree/master/examples'>link</a>. <br/>

## Proposals and contribution:

  Feel free to contibute or mail me with questions/proposals/issues (Neloreck@gmail.com). <br/>

## Licence

MIT
