import immer from 'immer'
import {
  createStore as createGenericStore,
  composeStore as composeGenericStore
} from './core'
import type {
  State,
  StateUpdater,
  Store,
  StoreCreator,
  StoreCreatorProps
} from './types'

export * from './types'

// Immutable state updates
const updateState = (state: State, stateProps: State | StateUpdater): State =>
  immer<State>(state, stateProps instanceof Function
    ? stateProps
    : draft => {
      Object.assign(draft, stateProps)
    }
  )

export const createStore: StoreCreator = (props: StoreCreatorProps = {}): Store =>
  createGenericStore({
    ...props,
    updateState
  })

export const composeStore = (stores: StoreCreatorProps[], context = {}): Store =>
  composeGenericStore(stores, context, createStore)
