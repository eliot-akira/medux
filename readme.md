# Medux: Modular immutable state management

## Store

```js
import createStore from 'medux'

const storeProps = {
  state: {
    count: 0
  },
  // ..or..
  createState: () => ({ count: 0 }),

  actions: {
    // Use any [key] for action, can be async
    increment(store, props = 1) {
      // Produce new state using immer
      store.setState({
        count: store.state.count + props
      })
      // ..or..
      store.setState(draft => {
        draft.count += props
      })
    },
  },
  
  // Optional
  onSetState(store) {},
  onAction(store, actionName, actionProps) {},
}

const store = createStore(storeProps)

store.increment(5) // store.state.count === 5

store.state.count++ // Error, must use setState or action
```

## Child stores

```js
const store = createStore({
  ...storeProps,
  stores: {
    // Use any [key] for child store
    child: storeProps
  }
})

store.child.increment(5)

// store.state.child.count === 5
```

## React

```js
import withStore from 'medux/react'

const storeProps = {
  state: {
    count: 0
  },
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

export deafult withStore(storeProps)(Component)
```

## Redux DevTools

```js
import connectReduxDevTools from 'medux/react/redux-devtools'

const storeProps = {
  didMount(store) {
    connectReduxDevTools('Store name', store)
  }
}
```

## Develop

For developing this library

```sh
yarn # Install dependencies

yarn dev # Develop: Watch files, recompile and test on changes

yarn build # Build

npm run release # Publish to NPM
```
