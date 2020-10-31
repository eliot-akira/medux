import { createStore } from './create'
import type {
  State,
  StateCreator,
  Actions,
  Store,
  StoreCreatorProps
} from './types'

export const composeStoreProps = (stores: StoreCreatorProps[]) => {

  const createState: StateCreator = () => stores.reduce((obj: State, child: StoreCreatorProps) => {
    if (child.state) {
      Object.assign(obj, child.state)
    } else if (child.createState) {
      Object.assign(obj, child.createState())
    }
    return obj
  }, {})

  const actions: Actions = stores.reduce((obj: Actions, child: StoreCreatorProps) => {
    if (child.actions) {
      Object.assign(obj, child.actions)
    }
    return obj
  }, {})

  return {
    createState,
    actions
  }
}

export const composeStore = (stores: StoreCreatorProps[], context = {}, storeCreator = createStore): Store => {

  const {
    createState,
    actions
  } = composeStoreProps(stores)

  return storeCreator({
    context,
    createState,
    actions
  })
}
