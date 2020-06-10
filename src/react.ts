import { useState, useMemo } from 'react'
import { createStore } from './index'
import {
  Store,
  StoreCreatorProps
} from './types'

export const useStore = (props: StoreCreatorProps): Store => {

  // Minimal wrapper to re-render on setState

  const [state, setState] = useState({})

  state // Ignore: store.state is the single source of truth

  const store = useMemo(() => {

    const store = props.store || createStore(props)

    store.on('state', () => setState({}))

    return store
  }, [])

  return store
}
