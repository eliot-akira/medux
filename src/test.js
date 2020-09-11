import { test, runTests } from 'testra'
import {
  createStore,
  composeStore
} from './index'

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

// State

test('store.setState', it => {

  const store = createStore()

  const sameObj = {}
  const oldState = { index: 0, sameObj }
  const newState = store.setState(oldState)

  it('updates state', store.state.index===0, store.state, newState)
  it('creates new state on update', oldState!==newState)
  it('preserves unchaged objects', store.state.sameObj===sameObj)
})

test('store.setState(state, false)', it => {

  const store = createStore()

  // Silent setState
  let called = false
  store.on('state', () => called = true)
  store.setState({ index: -1 }, false)

  it('updates state silently when callback is false', store.state.index===-1)
  it('does not emit state event when callback is false', !called)
})

// Actions

test('store.actions[action]', it => {
  const oldState = { index: 0 }
  const store = createStore({
    createState: () => oldState,
    actions: {
      increment() {
        this.setState({ index: store.state.index+1 })
      }
    }
  })

  store.actions.increment()
  it('updates state', store.state.index===1)
  it('does not mutate state', store.state!==oldState)
  it('does not mutate state key', store.state.index!==oldState.index)
})

// Events

test('on(\'state\')', it => {

  let called = false
  let calledWithValue = 0

  const store = createStore({
    state: { index: 0 }
  })

  store.on('state', (state) => {
    called = true
    calledWithValue = state.index
  })

  store.setState({ index: 1 })

  it('is called on setState', called)
  it('is called on setState with fresh state', calledWithValue===1)
})

test('on(\'action\')', it => {

  let called = false
  let calledWithKey
  let calledWithProps

  const store = createStore({
    state: { index: 0 },
    actions: {
      increment(props) {
        this.setState(draft => {
          draft.index += props
        })
      }
    },
  })

  store.on('action', (key, props) => {
    called = true
    calledWithKey = key
    calledWithProps = props
  })

  store.actions.increment(2)

  it('is called on action', called)
  it('is called on action with key', calledWithKey==='increment')
  it('is called on action with props', calledWithProps===2)
})

// Child

test('child state and actions', it => {

  let called = false
  let childCalled = false
  const storeProps = {
    createState: () => ({
      index: 0,
      child: {
        index: 0
      }
    }),
    actions: {
      increment() {
        this.setState({ index: this.state.index + 1 })
      },
      child: {
        increment() {
          this.setState({ index: this.state.index + 1 })
          childCalled = true
        }
      }
    }
  }

  const store = createStore(storeProps)

  store.on('state', (state) => {
    called = true
  })

  it('has child state', store.state.child)
  it('has child actions', store.actions.child.increment)
  it('parent store state has child state', store.state.child)

  const oldParentState = store.state

  store.actions.child.increment()

  const newParentState = store.state

  it('action creates new parent state', oldParentState!==newParentState)
  it('action updates parent state', store.state.child.index===1)
  it('action does not affect unrelated parent state keys', store.state.index===0)

  it('action updates child store state', store.state.child.index===1)

  it('action calls child setState', childCalled)
  it('action calls parent setState', called)
})

// Context

test('action context', it => {

  const store = createStore({
    state: {},
    actions: {
      test() {

        it('has this', !!this)

        ;['on', 'off', 'emit'].forEach(key =>
          it(`has this.${key}`, !!this[ key ])
        )

        let eventCalled = false

        this.on('event', () => {
          eventCalled = true
        })

        try {
          this.emit('event')
          it('can call this.emit', true)
        } catch (error) {
          it('can call this.emit', false)
        }

        it('calls event handler', eventCalled)
      }
    }
  })

  store.actions.test()
})

// Compose

test('composeStore', it => {

  const positive = {
    createState: () => ({
      positive: 1
    }),
    actions: {
      add() {
        this.setState({
          positive: this.state.positive + 1
        })
      }
    }
  }

  let testActionContext
  const negative = {
    createState: () => ({
      negative: -1
    }),
    actions: {
      subtract() {
        this.setState({
          negative: this.state.negative - 1
        })
        testActionContext = this.context
      }
    }
  }

  const context = { key: 123 }
  const store = composeStore([
    positive,
    negative
  ], context)

  it('creates a store from an array of store props', store && store.state && store.actions)
  it('store has given state properties', store.state.positive===1 && store.state.negative===-1)
  it('store has given actions', store.actions.add && store.actions.subtract)
  it('store has given context', store.context.key===123)

  store.actions.add()
  store.actions.subtract()

  it('store actions set their state',
    store.state.positive===2
    && store.state.negative===-2
  )

  it('action has this.context', testActionContext && testActionContext.key===123)
})

export default runTests()
