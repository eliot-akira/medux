// https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/

const key = '__REDUX_DEVTOOLS_EXTENSION__'
const ReduxDevTools = typeof window !== 'undefined' && window[key] ? window[key] : null

export default function connectReduxDevTools(name, store) {

  if (!ReduxDevTools) return

  if (!store) {
    store = name
    name = 'App'
  }

  const options = { serialize: true }
  const broadcaster = ReduxDevTools.connect({ name })

  broadcaster.init(store.getState())

  store.broadcast = (store, key, props) => broadcaster.send(
    { type: key, props },
    store.getState(),
    options,
    key
  )

  return store
}
