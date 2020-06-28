import immer from 'immer'
import { createStore as createGenericStore } from './core'
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

export const createStore: StoreCreator = (props: StoreCreatorProps = {}): Store => {
  return createGenericStore({
    ...props,
    updateState
  })
}
