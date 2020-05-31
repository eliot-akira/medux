import { EventEmitter } from './event'

export type State = {
  [key: string]: any
}

export type Action = (storeProps: StoreProps, ...args: any[]) => any

export type Actions = {
  [key: string]: Action | Actions
}

export type Context = {
  [key: string]: any
}

export type StateCreator = () => State
export type StateUpdater = (state: State) => void
export type SetStateCallback = () => any

export type StateGetter = () => State
export type StateSetter = (newState: State, callback?: SetStateCallback) => State

export type ActionsCreatorProps = {
  parentKey?: string
  actions: Actions
  getState: StateGetter
  setState: StateSetter
  onAction: ActionListener
  context?: Context
}

export type ActionsCreator = (props: ActionsCreatorProps) => Actions
export type ActionListener = (actionKey: string, actionProps: any, ...args: any[]) => void

export type Store = StoreProps & EventEmitter

export type StoreProps = {
  context: Context
  state: State
  getState: StateGetter
  setState: StateSetter
  actions: Actions
}

export type StoreCreator = (props: StoreCreatorProps) => Store
export type StoreCreatorProps = {
  state?: State
  createState?: StateCreator,
  actions: Actions,
  context?: Context
}
