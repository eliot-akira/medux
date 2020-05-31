import { useState, useMemo, useRef } from 'react'
import { createEventEmitter } from './event'
import { createActions } from './action'
import {
  State,
  StateGetter, StateSetter,
  SetStateCallback,
  Actions, ActionListener,
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
    const setState: StateSetter = (stateProps: State, callback: SetStateCallback): State => {

      const newState = {
        ...getState(),
        ...stateProps
      }

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
