import { useState } from 'react'
import { createStore } from './index'
import {
  Store,
  StoreCreatorProps
} from './types'

export const useStore = (props: StoreCreatorProps & { store: Store }): Store => {

  const store = props.store || createStore(props)
  const [state, setState] = useState({})

  store.on('state', () => setState({}))
  state // Ignore: store.state is the single source of truth

  return store
}
