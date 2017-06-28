import React from 'react'
import ReactDOM from 'react-dom'

import { AppContainer } from 'react-hot-loader'
import Application from './Application'

const container = document.createElement('div')
container.setAttribute('id', 'container')
document.body.appendChild(container)

process.nextTick(() => {
  ReactDOM.render(
    <AppContainer>
      <Application />
    </AppContainer>,
    container
  )
})

if (module.hot) {
  module.hot.accept('./Application', () => {
    const NextApp = require('./Application').default
    ReactDOM.render(
      <AppContainer>
        <NextApp />
      </AppContainer>,
      container
    )
  })
}
