import React, { Component } from 'react'
import {
  State,
  Store, StoreProps,
} from './types'
import createStore from './index'

const lifeCycleHooks = {
  didMount: 'componentDidMount',
  willUnmount: 'componentWillUnmount',
  shouldUpdate: 'shouldComponentUpdate',
  didUpdate: 'componentDidUpdate',
  willUpdate: 'componentWillUpdate'
}

const withStore = (storeProps: StoreProps = {}) => TargetComponent => {

  const {
    createState,
    actions = {},
    onAction,
    onSetState,
    stores = {},
    ...extendedProps
  } = storeProps

  let stateReference = storeProps.state

  return class StatefulComponent extends Component {

    public store: Store
    public props: any

    constructor(props) {

      super(props)

      this.store = createStore({
        createState: (store) => createState
          ? createState(store, this.props)
          : stateReference
        ,
        actions,
        onAction,
        onSetState: (store, update = true) => {
          stateReference = store.state
          const done = () => update && onSetState && onSetState(store, this.props)
          update && this.setState({}, done) // Re-render
        },
        stores
      })

      Object.keys(extendedProps).forEach(key => {
        if (!lifeCycleHooks[key]) return
        this[ lifeCycleHooks[key] ] = (...args) => extendedProps[key](
          this.props.store || this.store, // Allow parent to override store
          this.props,
          ...args
        )
      })
    }

    render() {
      return <TargetComponent {...{
        store: this.store,
        ...this.props // Allow parent to override store
      }} />
    }
  }
}

export default withStore