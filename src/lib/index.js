import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import reducer from './reducer'
import epic from './epic'

import core from './core'
import overlays from './overlays'

const middleware = createEpicMiddleware(epic)
const store = createStore(reducer, applyMiddleware(middleware))

class Module extends Component {
  store = store

  getChildContext () {
    return { storeSubscription: null }
  }

  render () {
    return (
      <Provider store={this.store}>
        <core.components.map>
          {overlays.map(({ components }, index) => (
            <components.overlay key={index} />
          ))}
        </core.components.map>
      </Provider>
    )
  }
}

Module.childContextTypes = {
  storeSubscription: PropTypes.any
}

export default Module
