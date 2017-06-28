import { SET_SELECTION, FETCH_POINTS_REQUEST, FETCH_DATA_REQUEST } from './actionTypes'

export const setSelection = (selection) => ({ type: SET_SELECTION, selection })
export const fetchPoints = () => ({ type: FETCH_POINTS_REQUEST })
export const fetchData = (index) => ({ type: FETCH_DATA_REQUEST, index })
