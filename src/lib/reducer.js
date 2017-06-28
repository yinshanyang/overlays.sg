import { combineReducers } from 'redux'
import core from './core'
import overlays from './overlays'

export default combineReducers({
  [core.constants.KEY]: core.reducer,
  ...overlays
    .reduce((memo, overlay) => ({
      ...memo,
      [overlay.constants.KEY]: overlay.reducer
    }), {})
})
