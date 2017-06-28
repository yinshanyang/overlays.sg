import { SET_SELECTION } from './actionTypes'

const initialState = {
  selection: null
}

export default function reducer (state = initialState, action = {}) {
  switch (action.type) {
    case SET_SELECTION:
      return {
        ...state,
        selection: action.selection
      }
    default:
      return state
  }
}
