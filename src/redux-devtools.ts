import { State, Store } from './types'

declare var window: any

const key = '__REDUX_DEVTOOLS_EXTENSION__'
const ReduxDevTools = typeof window !== 'undefined' && window[key] ? window[key] : null

type Broadcaster = {
  init: (state: State) => any,
  send: (...args: any[]) => any
}

const broadcasters: {
  [key: string]: Broadcaster
} = {}

export default function connectReduxDevTools(name: string, store: Store, options: any = {}) {

  // https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/

  if (!ReduxDevTools) return

  let broadcaster: Broadcaster

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
