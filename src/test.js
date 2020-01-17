import createStore from './index'

// Tester

const results = { success: 0, fail: 0 }

const assert = (title, result) => {
  console.log(`  ${result ? '✓' : '✕'}`, title)
  results[ result ? 'success' : 'fail' ]++
}

const test = (title, fn) => {
  console.log(title)
  return fn(assert)
}

const report = () => {
  const { success, fail } = results
  if (success) console.log(success, `test${ success > 1 ? 's' : '' } passed`)
  if (fail) console.log(fail, `test${ fail > 1 ? 's' : '' } failed`)
}

// Tests

test('medux', it => {
  it('exports createStore', createStore)
})


test('createStore', it => {
  it('is a function', createStore instanceof Function)
  const store = createStore()
  it('creates a store', store)
})

test('store', it => {

  const store = createStore()
  const properties = [
    'state', 'getState', 'setState'
  ]

  properties.forEach(key => it(`store.${key} exists`, store[key]))
})

test('store.setState', it => {

  const store = createStore()

  const sameObj = {}
  const oldState = { index: 0, sameObj }
  const newState = store.setState(oldState)

  it('updates state', store.state.index===0)
  it('creates new state on update', oldState!==newState)
  it('preserves unchaged objects', store.state.sameObj===sameObj)
})

test('store[action]', it => {
  const oldState = { index: 0 }
  const store = createStore({
    state: oldState,
    actions: {
      increment(store) {
        store.setState({ index: store.state.index+1 })
      }
    }
  })

  store.increment()
  it('updates state', store.state.index===1)
  it('does not mutate state', store.state!==oldState)
  it('does not mutate state key', store.state.index!==oldState.index)
})

test('onSetState', it => {

  let called = false
  let calledWithValue = 0

  const store = createStore({
    state: { index: 0 },
    onSetState(store) {
      called = true
      calledWithValue = store.state.index
    }
  })

  store.setState({ index: 1 })

  it('is called on setState', called)
  it('is called on setState with fresh state', calledWithValue===1)
})

test('onAction', it => {

  let called = false
  let calledWithKey
  let calledWithProps

  const store = createStore({
    state: { index: 0 },
    actions: {
      increment: (store, props) => store.setState(draft => {
        draft.index += props
      })
    },
    onAction(store, key, props) {
      called = true
      calledWithKey = key
      calledWithProps = props
    }
  })

  store.increment(2)

  it('is called on action', called)
  it('is called on action with key', calledWithKey==='increment')
  it('is called on action with props', calledWithProps===2)
})

test('store[childStore]', it => {

  let called = false
  let childCalled = false
  const storeProps = {
    state: { index: 0 },
    actions: {
      increment(store) {
        store.setState({ index: store.state.index + 1 })
      }
    }
  }
  const store = createStore({
    ...storeProps,
    stores: {
      child: {
        ...storeProps,
        onSetState(store) {
          childCalled = true
        }
      }
    },
    onSetState(store) {
      called = true
    }
  })

  it('is created', store.child)
  it('has state', store.child.state)
  it('has actions', store.child.increment)
  it('parent store state has child state', store.state.child)
  it('parent and child stores have same child state reference', store.state.child===store.child.state)

  const oldParentState = store.state

  store.child.increment()

  const newParentState = store.state

  it('action creates new parent state', oldParentState!==newParentState)
  it('action updates parent state', store.state.child.index===1)
  it('action does not affect unrelated parent state keys', store.state.index===0)

  it('action updates child store state', store.child.state.index===1)
  it('state update after action is shared by parent and child store', store.state.child===store.child.state)

  it('action calls child onSetState', childCalled)
  it('action calls parent onSetState', called)
})

report()
