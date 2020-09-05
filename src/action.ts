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
  context = {},
  onAction,
  parentKey = '',
  emitter = {},
}) => {

  const boundActions: Actions = {}

  const actionContext: ActionContext = {
    ...emitter, // Pass event emitter methods
    state: getState(),
    createState,
    getState,
    setState,
    actions: boundActions,
    context,
  }

  return Object.keys(actions).reduce((obj, key) => {

    const actionKey = (parentKey ? parentKey+'.' : '') + key

    if (actions[key] instanceof Function) {

      // Bind action to pass store props as `this`
      obj[key] = (props: any, ...args: any[]) => (actions[key] as Action).call(
        // Keep reference to same context
        Object.assign(actionContext, {
          state: getState(),
          // Wrap setState for onAction callback
          setState: (newState: State, callback?: SetStateCallback) => {
            const result = setState(newState, callback)
            onAction && onAction(actionKey, props, ...args)
            return result
          },
        }),
        props, ...args
      )

      return obj
    }

    // Child actions operate on a slice of state
    obj[key] = typeof actions[key]==='object'
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
  }, boundActions)
}
