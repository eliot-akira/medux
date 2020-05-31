import { State, Store } from './types'

declare var window: {
  [key: string]: any
}

/**
 * @see https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/
 */
const key = '__REDUX_DEVTOOLS_EXTENSION__'
const ReduxDevTools = typeof window !== 'undefined' && window[key] ? window[key] : null

type Broadcaster = {
  init: (state: State) => any
  send: (...args: any[]) => any
  subscribe: (callback: (message: { type: string, state: string }) => void) => void
}

const broadcasters: {
  [key: string]: Broadcaster
} = {}

export function connectReduxDevTools(name: string | Store, store?: Store | any, options: any = {}): Store {

  if (!ReduxDevTools) return store

  if (typeof name!=='string') {
    // connectReduxDevTools(store, options)
    options = store || {}
    store = name as Store
    name = 'App'
  }

  // Create once
  const broadcaster: Broadcaster = broadcasters[ name ] =
      broadcasters[ name ] || ReduxDevTools.connect({ name })

  broadcaster.init(store.state)

  broadcaster.subscribe((message) => {
    if (message.type === 'DISPATCH' && message.state) {
      store.setState(JSON.parse(message.state))
    }
  })

  store.on('action', (type: string, props: any) => {
    broadcaster.send(
      {
        type,
        props
      },
      store.getState(),
      options,
      type
    )
  })

  return store
}
