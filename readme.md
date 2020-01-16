# Modular immutable state management

```js
import createStore from 'medux'

const store = createStore({
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
})

store.increment(5)
```
