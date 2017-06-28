import { createSelector } from 'reselect'
import * as turf from '@turf/turf'
import * as constants from './constants'

export const getState = (state) => state[constants.KEY]

export const getSelection = createSelector(
  getState,
  ({ selection }) => selection === null
    ? turf.featureCollection([])
    : {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: selection
      },
      properties: {}
    }
)

export const getPoints = createSelector(
  getState,
  ({ points }) => points
)

export const getData = createSelector(
  getState,
  ({ data }) => data === null
    ? turf.featureCollection([])
    : data
)

export const getFilters = createSelector(
  getState,
  ({ filters }) => filters
)

export const getAreas = createSelector(
  getData,
  (data) =>
    [15, 30, 45, 60]
      .map((time) => ({
        time,
        area: turf.area(turf.featureCollection(data.features.filter((feature) => feature.properties.time === time * 60))) / (719.1 * 1000 * 1000)
      }))
)
