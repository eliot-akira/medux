import immer from 'immer'
import { createEventEmitter } from './event'
import { createActions } from './action'
import {
  State,
  StateSetter,
  StateUpdater,
  SetStateCallback,
  Actions,
  Store,
  StoreCreator,
  StoreCreatorProps
} from './types'

export const createStore: StoreCreator = (props?: StoreCreatorProps): Store => {

  const {
    state: initState,
    createState = () => ({}),
    actions: initActions = {},
    context = {}
  } = props || {}

  const store = createEventEmitter() as Store

  let state = initState || createState()

  const getState = () => state
  const setState: StateSetter = (stateProps: State | StateUpdater, callback?: SetStateCallback): State => {

    // Immutable state updates
    state = immer<State>(getState(), stateProps instanceof Function
      ? stateProps
      : draft => {
        Object.assign(draft, stateProps)
      }
    )

    store.state = state

    callback && callback()
    store.emit('state', state)

    return state
  }
  const actions: Actions = createActions({
    actions: initActions,
    getState,
    setState,
    onAction: (...args) => store.emit('action', ...args),
    context
  })

  return Object.assign(store, {
    context,
    state,
    getState,
    setState,
    actions
  })
}
