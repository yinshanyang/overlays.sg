import axios from 'axios'
import { Observable } from 'rxjs/Observable'
import { SET_SELECTION, FETCH_POINTS_REQUEST, FETCH_POINTS_SUCCESS, FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS } from './actionTypes'
import { KEY } from './constants'
import nearest from '@turf/nearest'

const urls = {
  points: require('./data/points.csv'),
  data: `/data/${KEY}/isochrones`
}

// setSelection listener
const setSelection = (action$, state) =>
  action$
    .ofType(SET_SELECTION)
    .map(() => state.getState()[KEY])
    .map(({ selection, points }) => {
      if (selection === null) return null
      const point = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: selection
        },
        properties: {}
      }
      const nearestPoint = nearest(point, points)

      return nearestPoint.properties.data
        ? nearestPoint.properties.index
        : null
    })
    .map((index) => ({ type: FETCH_DATA_REQUEST, index }))

const fetchPoints = (action$) =>
  action$
    .ofType(FETCH_POINTS_REQUEST)
    .switchMap(() =>
      Observable.fromPromise(
        axios({
          method: 'get',
          url: urls.points
        })
      ).takeUntil(action$.ofType(FETCH_POINTS_REQUEST))
    )
    .map(({ data }) => data)
    // parse CSV
    .map((csv) => {
      const body = csv.split('\n').map((row) => row.split(','))
      const headers = body.shift()
      return body.map((row) =>
        row
          .map((value, index) => ({
            key: headers[index],
            value
          }))
          .reduce((memo, { key, value }) => ({ ...memo, [key]: value }), {})
      )
    })
    // cast data
    .map((data) =>
      data.map(({ index, lat, lon, data }) => ({
        index: +index,
        lat: +lat,
        lon: +lon,
        data: data === 'true'
      }))
    )
    // transform to GeoJSON
    .map((data) => ({
      type: 'FeatureCollection',
      features: data.map(({ index, lat, lon, data }) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lon, lat]
        },
        properties: {
          index,
          data
        }
      }))
    }))
    .map((points) => ({ type: FETCH_POINTS_SUCCESS, points }))

const fetchData = (action$) =>
  action$
    .ofType(FETCH_DATA_REQUEST)
    .map(({ index }) => index)
    .switchMap((index) =>
      index === null
        ? Observable.of({data: null})
        : Observable.fromPromise(
          axios({
            method: 'get',
            url: `${urls.data}/${index}.geo.json`
          })
        ).takeUntil(action$.ofType(FETCH_DATA_REQUEST))
    )
    .map(({ data }) => data)
    .map((data) => ({ type: FETCH_DATA_SUCCESS, data }))

export default [
  setSelection,
  fetchPoints,
  fetchData
]
