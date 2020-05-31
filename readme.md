# Medux: Modular immutable state management

Manage state and actions using [`immer`](https://github.com/immerjs/immer)

## Getting Started

```sh
yarn add medux
```

## Store

```js
import { createStore } from 'medux'

const initState = {
  count: 0
}

const initActions = {
    increment(num = 1) {
      
      // Actions have `this` bound to the store

      // Produce new state by modifying draft
      this.setState(draft => {
        draft.count += num
      })

      // ..or merge into new state
      this.setState({
        count: this.state.count + 1
      })

      // Optionally call other actions
      this.actions.action()
    },

    // Actions can be async
    async action(props) {}
  }
}

const store = createStore(initState, initActions)

store.on('action', (store, key, props) =>{
  console.log('Action called', key, props)
  console.log('State changed', store.state)
})

store.actions.increment(5)

console.log(store.state) // { count: 5 }
```

### Immutability

```js
const oldState = store.state

store.increment(5)

const newState = store.state // oldState !== newState

store.state.count++ // Error, must use setState or action
```

## Child stores

```js
const parentState = {
  child: childState
}

const parentActions = {
  child: childActions
}

const store = createStore(parentState, parentActions)

store.actions.child.increment(5)

console.log(store.state.child) // { count: 5 }
```

## Redux DevTools

```js
import connectReduxDevTools from 'medux/redux-devtools'

  const store = useStore(initState, initActions)

  useEffect(() => {
    connectReduxDevTools(store)
  }, [])

  return ..
}
```

## React

```js
import { useStore } from 'medux/react'

const Component = () => {

  const store = useStore(initState, initActions)
  const { state, actions } = store

  return <button onClick={() => actions.increment()}>
    Increment: { state.count }
  </button>
}
```

### React with Redux DevTools

```js
import { useEffect } from 'react'
import { useStore } from 'medux/react'
import connectReduxDevTools from 'medux/redux-devtools'

const Component = () => {

  const store = useStore(initState, initActions)

  useEffect(() => {
    connectReduxDevTools(store)
  }, [])

  return ..
}
```

With options for Redux DevTools

```js
connectReduxDevTools(store, options)
```

With store instance name

```js
connectReduxDevTools('App', store, options)
```


## Develop this library

Install dependencies

```sh
yarn
```

Develop: Watch files; Recompile, type check and test on changes

```sh
yarn dev
```

Build

```sh
yarn build
```

Publish to NPM

```sh
npm run release
```
