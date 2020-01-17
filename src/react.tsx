import React, { Component } from 'react'
import {
  State,
  Store, StoreProps,
} from './types'
import createStore from './index'

export type LifeCycleMethod = (
  store: Store,
  props: { [key: string]: any },
  ...args: any[]
) => any

export type LifeCycleMethods = {
  didMount?: LifeCycleMethod
  willUnmount?: LifeCycleMethod
  shouldUpdate?: LifeCycleMethod
  didUpdate?: LifeCycleMethod
}

const withStore = (storeProps: StoreProps & LifeCycleMethods = {}) => TargetComponent => {

  const {
    createState,
    actions = {},
    onAction,
    onSetState,
    stores = {},
    ...lifecycleProps
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
    }

    lifecycle = (key: string, ...args: any[]) => lifecycleProps[key] && lifecycleProps[key](
      this.props.store || this.store, // Allow parent to override store
      this.props,
      ...args
    )

    componentDidMount(...args: any[]) {
      this.lifecycle('didMount', ...args)
    }

    componentWillUnmount(...args: any[]) {
      this.lifecycle('willUnmount', ...args)
    }

    shouldComponentUpdate(...args: any[]) {
      if (!lifecycleProps.shouldUpdate) return true
      return this.lifecycle('shouldUpdate', ...args)
    }

    componentDidUpdate(...args: any[]) {
      this.lifecycle('didUpdate', ...args)
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
