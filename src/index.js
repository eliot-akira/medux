import immer from 'immer'

const createStore = (storeProps = {}) => {

  const {
    createState,
    actions = {},
    onAction,
    onSetState,
    stores,
    actionKey = ''
  } = storeProps

  let stateReference = storeProps.state || {}

  const store = {
    getState: () => store.state,
    setState: (newState, update = true) => {

      // Immutable state updates

      if (newState instanceof Function) {
        store.state = immer(store.state, newState)
      } else {
        store.state = immer(store.state, draft => {
          Object.assign(draft, newState)
        })
      }

      // Update persistent state reference
      stateReference = store.state

      if (update && onSetState) {
        onSetState(store, update)
      }

      return store.state
    }
  }

  const actionMiddleware = (key, props, result) => {

    const done = () => {
      if (onAction) {
        onAction(store, key, props)
      }

      // Support for Redux DevTools
      if (store.broadcast) {
        store.broadcast(store, key, props)
      }
    }

    if (result instanceof Promise) {
      result.then(done)
    } else {
      done()
    }

    return result
  }

  Object.keys(actions).forEach(key => {
    store[key] = props => actionMiddleware(
      key,
      props,
      actions[key](store, props)
    )
  })

  // Action key prefix passed from parent store, if any
  store.actionKey = actionKey

  store.state = createState
    // New state every time store is created
    ? createState(store)
    // Persistent state reference
    : stateReference

  if (!stores) return store

  // Child stores

  const parentStore = store
  const createChildStore = key => {

    const childStoreProps = stores[key]

    parentStore[key] = createStore({
      ...childStoreProps,

      // Pass down action key prefix
      actionKey: `${actionKey ? actionKey+'.' : ''}${key}`,

      createState(childStore) {

        // Persistent child state reference
        if (childStoreProps.state) {
          // Inherit from parent store's state reference, if any
          return parentStore.state[key] || childStoreProps.state
        }

        // New child state every time child store is created
        return childStoreProps.createState(childStore)
      },

      onSetState(childStore, update = true) {

        parentStore.setState(draft => {
          draft[key] = childStore.state
        }, update)

        if (childStoreProps.onSetState) {
          childStoreProps.onSetState(childStore)
        }
      },

      onAction(childStore, childActionKey, actionProps) {
        // Notify parent store
        const parentArgs = [parentStore, `${key}.${childActionKey}`, actionProps]
        if (onAction) {
          onAction(...parentArgs)
        }
        if (parentStore.broadcast) {
          parentStore.broadcast(...parentArgs)
        }
        if (childStoreProps.onAction) {
          childStoreProps.onAction(childStore, childActionKey, actionProps)
        }
      }
    })

    // Assign child state to parent store without triggering onSetState
    parentStore.setState(draft => {
      draft[key] = parentStore[key].state
    }, false)
  }

  Object.keys(stores).forEach(createChildStore)

  return store
}

export default createStore
