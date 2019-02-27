# <a href='https://www.npmjs.com/package/dreamstate'> 🗻 dreamstate </a>

[![npm version](https://img.shields.io/npm/v/dreamstate.svg?style=flat-square)](https://www.npmjs.com/package/dreamstate)
[![language-ts](https://img.shields.io/badge/language-typescript%3A%20100%25-blue.svg?style=flat)](https://github.com/Neloreck/redux-cbd/search?l=typescript)<br/>
[![start with wiki](https://img.shields.io/badge/docs-wiki-blue.svg?style=flat)](https://github.com/Neloreck/dreamstate/wiki)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/Neloreck/redux-cbd/blob/master/LICENSE)
<br/>
[![npm downloads](https://img.shields.io/npm/dt/dreamstate.svg?style=flat-square)](https://www.npmjs.com/package/dreamstate)
[![HitCount](http://hits.dwyl.com/neloreck/dreamstate.svg)](http://hits.dwyl.com/neloreck/dreamstate)

<hr/>

The simplest and smallest class based storage for react with lifecycle. <br/>
React API and nothing more.

<hr/>

## Installation

- `npm install --save dreamstate`

<b>Important:</b>
- Package requires 'react' as peer dependency.
- Package uses 'expirementalDecorators' features. You should configure your project bundler correctly.

<hr/>

## Docs

| @[Decorators](https://github.com/Neloreck/dreamstate/wiki/Decorators)| [Utils](https://github.com/Neloreck/dreamstate/wiki/Utils)|
| :------------- | :------------- |
| @[Consume](https://github.com/Neloreck/dreamstate/wiki/@Consume) | [ReactContextManager](https://github.com/Neloreck/dreamstate/wiki/ReactContextManager) |
| @[Provide](https://github.com/Neloreck/dreamstate/wiki/@Provide) | - |
| @[Bind](https://github.com/Neloreck/dreamstate/wiki/@Bind) | - |


## Example (wiki contains more explanations):


<details><summary>Single file pure JS example:</summary>
<p>
    
```javascript jsx
import * as React from 'react';
import { PureComponent } from 'react';
import { render } from 'react-dom';

import { Bind, Consume, Provide, ReactContextManager } from 'dreamstate';

// Context store creation.
export class AuthContext extends ReactContextManager {

  // Wrap your actions and state separately to avoid naming collisions.
  context = {
    authActions: {
      switchAuthStatus: this.switchAuthStatus,
      randomizeUserAsync: this.randomizeUserAsync,
      randomizeUser: this.randomizeUser
    },
    authState: {
      isAuthenticated: true,
      user: 'initial'
    }
  };

  setState = ReactContextManager.getSetter(this, 'authState');

  // Bind decorator. Arrow functions-methods/.bind(this) or lambdas can be used for binding too.
  @Bind()
  switchAuthStatus() {
    this.setState({ isAuthenticated: !this.context.authState.isAuthenticated });
  };

  @Bind()
  randomizeUser() {
    this.setState({ user: 'user-' + Math.floor(Math.random() * 100) });
  };

  @Bind()
  randomizeUserAsync() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.setState({ user: 'user-' + Math.floor(Math.random() * 10000) });
        resolve();
      }, 3000)
    });
  };

  // First provider mounted.
  onProvisionStarted() {
    console.info('Data provision started.');
  }

  // Context was updated.
  afterUpdate() {
    console.info('Data updated:', this.context.authState);
  }

}

// Singleton instance. Should be located in some kind of stores 'index' module file.
const authContext = new AuthContext();

// Context consuming component with reactive subscription.
@Consume(authContext)
export class MainView extends PureComponent {

  paddingStyle = { padding: '10px' };

  render() {

    const {
      label,
      authState: { user, isAuthenticated },
      authActions: { randomizeUser, randomizeUserAsync, switchAuthStatus }
    } = this.props;

    return (
      <div style={this.paddingStyle}>

        <div> External prop value: '{ label }' </div>

        <div style={this.paddingStyle}>
          <span>USERNAME: </span> {user} <br/>
          <span>AUTHENTICATED: </span>  {isAuthenticated.toString()} <br/>
        </div>

        <div style={this.paddingStyle}>
          <button onClick={switchAuthStatus}>Switch Authentication Status</button>
          <button onClick={randomizeUserAsync}>Randomize User Async</button>
          <button onClick={randomizeUser}>Randomize User</button>
        </div>

      </div>
    );
  }

}

// Component with provider. All consumers should be under it in the react-dom tree.
@Provide(authContext)
export class Application extends PureComponent {

  render() {

    const { children } = this.props;

    return children;
  }

}

// Render into DOM.
render(
  <Application>
    <MainView label={ 'First item with consumer.'}/>
    <MainView label={ 'Second item with consumer.'}/>
  </Application>,
  document.getElementById('application-root')
);

```
</p>
</details>

<details><summary>TS Application entrypoint example.</summary>
<p>
    
```typescript jsx
import * as React from "react";
import { render } from "react-dom";

import { MainView, IMainViewExternalProps } from "./view/MainView";

render(
  <div>

    <h2> Both components are connected to the same store, so they are in total sync: </h2>

    <MainView someLabelFromExternalProps={"First component."} {...{} as IMainViewExternalProps}/>
    <MainView someLabelFromExternalProps={"Second component."} {...{} as IMainViewExternalProps}/>

  </div>,
  document.getElementById("application-root")
);

```

</p>
</details>

<details><summary>Context store reexport and signleton creation.</summary>
<p>
    
```typescript jsx
import { AuthContextManager } from "./AuthContextManager";
import { DataContextManager } from "./DataContextManager";

export * from "./AuthContextManager";
export * from "./DataContextManager";

export const authContextManager: AuthContextManager = new AuthContextManager();
export const dataContextManager: DataContextManager = new DataContextManager();
```

</p>
</details>

<details><summary>Context and handlers declaration.</summary>
<p>
    
```typescript jsx
import { Bind, ReactContextManager } from "dreamstate";

/*
 * Context manager state declaration.
 * You can inject it into your component props type later.
 */

export interface IAuthContext {
  authActions: {
    setUser: (user: string) => void;
    setUserAsync: () => Promise<void>;
    changeAuthenticationStatus: () => void;
  };
  authState: {
    isAuthenticated: boolean;
    user: string;
  };
}

/*
 * Manager class example, single store for app data.
 * Allows to create consumers/providers components or to use decorators for injection.
 *
 * Also, you can store something inside of it (additional props, static etc...) instead of modifying state each time.
 */
export class AuthContextManager extends ReactContextManager<IAuthContext> {

  private static ASYNC_USER_CHANGE_DELAY: number = 3000;

  // Default context state.
  protected readonly context: IAuthContext = {
    // Some kind of handlers.
    authActions: {
      changeAuthenticationStatus: this.changeAuthenticationStatus,
      setUserAsync: this.setUserAsync,
      setUser: this.setUser
    },
    // Provided storage.
    authState: {
      isAuthenticated: true,
      user: "anonymous"
    }
  };

  private setContext = ReactContextManager.getSetter(this, "authState");

  @Bind()
  public changeAuthenticationStatus(): void {
    this.setContext({ isAuthenticated: !this.context.authState.isAuthenticated });
  }

  @Bind()
  public setUser(user: string): void {
    this.setContext({ user });
  }

  @Bind()
  public setUserAsync(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.setContext({ user: "user-" + Math.floor(Math.random() * 10000) });
        resolve();
      }, AuthContextManager.ASYNC_USER_CHANGE_DELAY)
    });
  }

}

```

</p>
</details>

<details><summary>Connected component.</summary>
<p>
  
```typescript jsx
import { Consume, Provide } from "dreamstate";
import * as React from "react";
import { PureComponent, ReactNode } from "react";

// Store related things.
import { authContextManager, dataContextManager, IAuthContext, IDataContext } from "../data";


// Props typing: own, injected and bundled props. You should know what has to be declared manually.
export interface IMainViewOwnProps { someLabelFromExternalProps: string; }
export interface IMainViewExternalProps extends IAuthContext, IDataContext {}
export interface IMainViewProps extends IMainViewExternalProps, IMainViewOwnProps {}

// Component related.
@Provide(authContextManager, dataContextManager)
@Consume(authContextManager, dataContextManager)
export class MainView extends PureComponent<IMainViewProps> {

  public render(): ReactNode {

    const {
      // Own prop.
      someLabelFromExternalProps,
      // Get, what you need form injected props.
      dataState: {value},
      dataActions: {setValue},
      authState: {user, isAuthenticated},
      authActions: {setUser, setUserAsync, changeAuthenticationStatus}
    } = this.props;

    const rootStyle = { border: "2px black solid", margin: 12, padding: 12 };
    const sectionStyle = { padding: 8 };

    return (
      <div style={rootStyle}>

        <div> External prop value: '{ someLabelFromExternalProps }' </div>

        <div style={sectionStyle}>

          <h5> Auth context: </h5>
          <span>USERNAME: </span> {user} <br/>
          <span>AUTHENTICATED: </span>  {isAuthenticated.toString()} <br/>
  
          <button onClick={changeAuthenticationStatus}>Change Authentication Status</button>
          <button onClick={setUserAsync}>Randomize User Async</button>
          <button onClick={() => setUser("user-" + Math.floor(Math.random() * 100))}>Randomize User</button>
       
        </div>

        <div style={sectionStyle}>

          <h5> Data context: </h5>
          <span>VALUE: </span> {value} <br/>

          <button onClick={() => setValue("value-" + Math.floor(Math.random() * 100))}>Randomize Value</button>

        </div>

      </div>
    );
  }

}

```
</p>
</details>


## Documentation:

Repository [wiki](https://github.com/Neloreck/dreamstate/wiki) includes docs and samples. <br/>

## Proposals and contribution:

Feel free to contibute or mail me with questions/proposals/issues (Neloreck@gmail.com). <br/>

## Full examples

Repository includes example project with commentaries: <a href='https://github.com/Neloreck/dreamstate/tree/master/examples'>link</a>. <br/>

## Licence

MIT
