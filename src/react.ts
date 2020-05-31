import { useState } from 'react'
import { createStore } from './index'
import {
  Store,
  StoreCreator,
  StoreCreatorProps
} from './types'

export const useStore: StoreCreator = (props: StoreCreatorProps & { store: Store }): Store => {

  const store = props.store || createStore(props)
  const [_, setState] = useState(store.state)

  store.on('state', setState)

  return store
}
