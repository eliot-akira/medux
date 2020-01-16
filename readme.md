# Modular immutable state management

## Store

```js
import createStore from 'medux'

const storeProps = {
  state: {
    count: 0
  },
  actions: {
    increment(store, props) {
      store.setState({
        count: store.state.count + (props || 1)
      })
    }
  },
  // Optional
  onSetState(store) {},
  onAction(store, actionName, actionProps) {},
}

const store = createStore(storeProps)

store.increment(5)

// store.state.count === 5
```

## Child stores

```js
const store = createStore({
  ...storeProps,
  stores: {
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
    increment(store, props) {
      store.setState({
        count: store.state.count + (props || 1)
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
