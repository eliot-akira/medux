import React, { Component } from 'react'
import createStore from './index'

const lifeCycleHooks = {
  didMount: 'componentDidMount',
  willUnmount: 'componentWillUnmount',
  shouldUpdate: 'shouldComponentUpdate',
  didUpdate: 'componentDidUpdate',
  willUpdate: 'componentWillUpdate'
}

const withStore = (storeProps = {}) => TargetComponent => {

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
          this.store,
          this.props,
          ...args
        )
      })
    }

    render() {
      return <TargetComponent {...this.props} store={this.store} />
    }
  }
}

export default withStore
