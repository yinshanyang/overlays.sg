import 'rxjs'
import { combineEpics } from 'redux-observable'
import core from './core'
import overlays from './overlays'

export default combineEpics(
  ...[
    ...core.epics,
    ...overlays
      .reduce((memo, overlay) => ([
        ...memo,
        ...overlay.epics
      ]), [])
  ]
)
