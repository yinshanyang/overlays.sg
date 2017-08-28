import { FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS } from './actionTypes'

import data from './data/data.geo.json'

const fetchData = (action$) =>
  action$
    .ofType(FETCH_DATA_REQUEST)
    .map(() => ({ type: FETCH_DATA_SUCCESS, data }))

export default [
  fetchData
]
