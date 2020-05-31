import immer from 'immer'
import { useState, useMemo } from 'react'
import { createEventEmitter } from './event'
import { createActions } from './action'
import {
  State,
  StateGetter,
  StateSetter,
  StateUpdater,
  SetStateCallback,
  Actions,
  Store,
  StoreCreator,
  StoreCreatorProps
} from './types'

export const useStore: StoreCreator = (props: StoreCreatorProps): Store => {

  const {
    state: initState,
    createState = () => ({}),
    actions: initActions,
    context = {}
  } = props

  const initStateOnMount = useMemo(() => initState || createState(), [])

  // After initial render, it returns the most recent state.
  const [state, setStoreState] = useState(initStateOnMount)

  const store = useMemo(() => {

    const store = createEventEmitter() as Store
    const getState: StateGetter = () => store.state
    const setState: StateSetter = (stateProps: State | StateUpdater, callback?: SetStateCallback): State => {

      // Immutable state updates
      const newState = immer<State>(getState(), stateProps instanceof Function
        ? stateProps
        : draft => {
          Object.assign(draft, stateProps)
        }
      )

      setStoreState(newState)

      // Ensure fresh state, because useState does not set state immediately.
      store.state = newState
      callback && callback()
      store.emit('state', newState)

      return newState
    }

    const actions: Actions = createActions({
      actions: initActions,
      getState,
      setState,
      onAction: (...args) => store.emit('action', ...args),
      context
    })

    return Object.assign(store, {
      state,
      getState,
      setState,
      actions,
      context
    })
  }, [])

  store.state = state

  return store
}
