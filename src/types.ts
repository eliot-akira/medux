
export type State = {
  [key: string]: any
}

export type StateCreator = (store: Store, ...args: any[]) => State
export type StateUpdater = (state: State) => any

export type Store = {
  state: State,
  getState: () => State,
  setState: (newState: State | StateUpdater, update?: boolean) => State,
  broadcast?: (store: Store, key: string, props: any) => any,
  [key: string]: Action | any
}

export type Action = (store: Store, props: any) => any

export type Actions = {
  [key: string]: Action
}

export type StoreProps = {
  state?: State,
  createState?: StateCreator,
  actions?: Actions,

  onSetState?: (store: Store, props: any) => any,
  onAction?: (store: Store, key: string, props: any) => any,

  stores?: {
    [key: string]: Store
  },

  actionKey?: string
}
