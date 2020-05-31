import {
  ActionsCreator,
  Actions,
  Action,
  State,
  SetStateCallback
} from './types'

export const createActions: ActionsCreator = ({
  actions,
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
      getState,
      // Wrap setState for onAction callback
      setState: (newState: State, callback?: SetStateCallback) => setState(newState, () => {
        callback && callback()
        onAction(actionKey, props, ...args)
      }),
      context,
    }, props, ...args)

    // Child actions operate on a slice of state
    : typeof actions[key]==='object'
      ? createActions({
        actions: actions[key] as Actions,
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
