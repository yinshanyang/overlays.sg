import { SET_SELECTION, FETCH_POINTS_SUCCESS, FETCH_DATA_SUCCESS } from './actionTypes'

const initialState = {
  filters: {
    time: 60 * 60
  },
  // selection: null,
  selection: [103.851523, 1.284127],
  points: null,
  data: null
}

export default function reducer (state = initialState, action = {}) {
  switch (action.type) {
    case SET_SELECTION:
      return {
        ...state,
        selection: action.selection
      }
    case FETCH_POINTS_SUCCESS:
      return {
        ...state,
        points: action.points
      }
    case FETCH_DATA_SUCCESS:
      return {
        ...state,
        data: action.data
      }
    default:
      return state
  }
}
