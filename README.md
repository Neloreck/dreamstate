# <a href='https://www.npmjs.com/package/dreamstate'> 🗻 dreamstate </a>

[![npm version](https://img.shields.io/npm/v/dreamstate.svg?style=flat-square)](https://www.npmjs.com/package/dreamstate)
[![language-ts](https://img.shields.io/badge/language-typescript%3A%20100%25-blue.svg?style=flat)](https://github.com/Neloreck/redux-cbd/search?l=typescript)<br/>
[![start with wiki](https://img.shields.io/badge/docs-wiki-blue.svg?style=flat)](https://github.com/Neloreck/dreamstate/wiki)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/Neloreck/redux-cbd/blob/master/LICENSE)
<br/>
[![npm downloads](https://img.shields.io/npm/dt/dreamstate.svg?style=flat-square)](https://www.npmjs.com/package/dreamstate)
[![HitCount](http://hits.dwyl.com/neloreck/dreamstate.svg)](http://hits.dwyl.com/neloreck/dreamstate)

<hr/>

The simplest and smallest class based storage for react with lifecycle and observers. <br/>
React API and nothing more.

<hr/>

## Installation

- `npm install --save dreamstate`

<b>Important:</b>
- Package requires 'react' as peer dependency.
- Package uses 'expirementalDecorators' features. You should configure your project bundler correctly if you want to use Bind/Consume/Provide.

<hr/>

## Docs

| @[Decorators](https://github.com/Neloreck/dreamstate/wiki/Decorators)| [Utils](https://github.com/Neloreck/dreamstate/wiki/Utils)|
| :------------- | :------------- |
| @[Consume](https://github.com/Neloreck/dreamstate/wiki/@Consume) | [ContextManager](https://github.com/Neloreck/dreamstate/wiki/ContextManager) |
| @[Provide](https://github.com/Neloreck/dreamstate/wiki/@Provide) | [useManager](https://github.com/Neloreck/dreamstate/wiki/useManager) |
| @[Bind](https://github.com/Neloreck/dreamstate/wiki/@Bind) | - |

## Documentation:

Repository [wiki](https://github.com/Neloreck/dreamstate/wiki) includes docs and samples. <br/>

## Full examples

Repository includes example project with commentaries: <a href='https://github.com/Neloreck/dreamstate/tree/master/examples'>link</a>. <br/>

## Known issues:
 - HOC decorators erase your class static context, so you are unable to use static methods/data.

## Proposals and contribution:

Feel free to contibute or mail me with questions/proposals/issues (Neloreck@gmail.com). <br/>

## Licence

MIT
