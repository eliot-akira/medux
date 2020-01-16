# Medux: Modular immutable state management

Manage state and actions using [`immer`](https://github.com/immerjs/immer)

## Store

```js
import createStore from 'medux'

const storeProps = {

  state: {
    count: 0
  },  

  actions: {
    increment(store, props = 1) {
      
      const currentState = store.state

      // Produce new state

      store.setState(draft => {
        draft.count += props
      })

      // Optionally call other actions
      store.action()
    },

    // Action can be async
    async action(store, props) {}
  },
  
  // Optional
  onSetState(store) {},
  onAction(store, key, props) {
    console.log(`store.${key}`, props, store.state)
  },
}

const store = createStore(storeProps)

store.increment(5) // store.state.count === 5
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
const store = createStore({
  ...storeProps,
  stores: {
    // Use any [key] for child store
    child: childStoreProps
  }
})

store.child.increment(5) // store.state.child.count === 5
```

## React

```js
import withStore from 'medux/react'

const storeProps = {

  state: { count: 0 },

  // To create fresh state every mount, use instead of state
  createState: () => ({ count: 0 }),

  actions: {
    increment(store, props = 1) {
      store.setState(draft => {
        draft.count += props
      })
    }
  },
  
  // Optional lifecycle methods, can be async
  didMount(store, props) {},
  willUnmount(store, props) {},
  shouldUpdate(store, props, prevProps) {},
  didUpdate(store, props) {}
}

const Component = ({ store }) =>
  <button
    onClick={() => store.increment(5)}
  >Increment</button>

export default withStore(storeProps)(Component)
```

## Redux DevTools

```js
import connectReduxDevTools from 'medux/react/redux-devtools'

connectReduxDevTools('Store name', store)

// With React
const storeProps = {
  didMount(store) {
    connectReduxDevTools('Component name', store)
  }
}
```

## Develop this library

Install dependencies

```sh
yarn
```

Develop: Watch files, recompile and test on changes

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
