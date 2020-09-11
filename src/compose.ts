import { createStore } from './create'
import type {
  State,
  StateCreator,
  Actions,
  Store,
  StoreCreatorProps
} from './types'

export const composeStore = (stores: StoreCreatorProps[], context = {}, storeCreator = createStore): Store => {

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

  return storeCreator({
    context,
    createState,
    actions
  })
}
