import { useState, useMemo } from 'react'
import {
  createStore,
  composeStore
} from './index'
import {
  Store,
  StoreCreatorProps
} from './types'

export const useStore = (props: StoreCreatorProps | StoreCreatorProps[], context = {}): Store => {

  // Minimal wrapper to re-render on setState

  const [state, setState] = useState({})

  state // Ignore: store.state is the single source of truth

  const store = useMemo(() => {

    const store = Array.isArray(props)
      ? composeStore(props, context)
      : (props.store || createStore(props))

    store.on('state', () => setState({}))

    return store
  }, [])

  return store
}
