import {
  ActionsCreator,
  Actions,
  Action,
  ActionContext,
  State,
  SetStateCallback
} from './types'

export const createActions: ActionsCreator = ({
  actions,
  createState,
  getState,
  setState,
  context,
  onAction,
  parentKey = ''
}) => Object.keys(actions).reduce((obj, key) => {

  const actionKey = (parentKey ? parentKey+'.' : '') + key

  obj[key] = actions[key] instanceof Function
    // Bind action to pass store props as `this`
    ? (props: any, ...args: any[]) => (actions[key] as Action).call({
      actions: obj,
      state: getState(),
      createState,
      getState,
      // Wrap setState for onAction callback
      setState: (newState: State, callback?: SetStateCallback) => setState(newState, () => {
        callback && callback()
        onAction(actionKey, props, ...args)
      }),
      context,
    } as ActionContext, props, ...args)

    // Child actions operate on a slice of state
    : typeof actions[key]==='object'
      ? createActions({
        actions: actions[key] as Actions,
        createState: () => createState()[key],
        getState: () => getState()[key],
        setState: (childState, callback) => setState({
          [key]: {
            ...getState()[key],
            ...childState
          }
        }, callback),
        context,
        onAction,
        parentKey: actionKey
      })
      : actions[key] // Unknown action type

  return obj
}, {} as Actions)
