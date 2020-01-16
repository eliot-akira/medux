// https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/

const key = '__REDUX_DEVTOOLS_EXTENSION__'
const ReduxDevTools = typeof window !== 'undefined' && window[key] ? window[key] : null
const broadcasters = {}

export default function connectReduxDevTools(name, store, options) {

  if (!ReduxDevTools) return

  if (!store) {
    store = name
    name = 'App'
  }

  let broadcaster

  if (broadcasters[name]) {
    broadcaster = broadcasters[name]
  } else {
    broadcaster = broadcasters[ name ] = ReduxDevTools.connect({ name })
  }

  broadcaster.init(store.state)

  store.broadcast = (store, key, props) => broadcaster.send(
    { type: key, props },
    store.state,
    {
      serialize: true,
      ...options
    },
    key
  )

  return store
}
