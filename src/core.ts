import { createEventEmitter } from './event'
import { createActions } from './action'
import type {
  State,
  StateSetter,
  StateUpdater,
  SetStateCallback,
  Actions,
  Store,
  StoreCreator,
  StoreCreatorProps
} from './types'

export * from './types'

// Mutable state updates
const defaultUpdateState = (state: State, stateProps: State | StateUpdater): State =>
  Object.assign(state, stateProps)

export const createStore: StoreCreator = (props?: StoreCreatorProps): Store => {

  const {
    state: initState,
    createState = () => initState
      ? JSON.parse(JSON.stringify(initState)) // Fast deep clone
      : {},
    actions: initActions = {},
    context = {},
    updateState = defaultUpdateState
  } = props || {}

  const store = createEventEmitter() as Store

  let state = initState || createState()

  const getState = () => state
  const setState: StateSetter = (stateProps: State | StateUpdater, callback?: SetStateCallback): State => {

    state = updateState(getState(), stateProps)

    store.state = state

    callback && callback()

    // Set state silently when callback is false
    if (callback!==false) store.emit('state', state)

    return state
  }
  const actions: Actions = createActions({
    actions: initActions,
    createState,
    getState,
    setState,
    onAction: (...args) => store.emit('action', ...args),
    context
  })

  return Object.assign(store, {
    context,
    state,
    createState,
    getState,
    setState,
    actions
  })
}
