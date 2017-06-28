import React from 'react'
import Config from '../../config'

import Map from '../Map'

// TODO: fix Config, set it in map state to props or something
const MapContainer = (props) => (
  <Map {...props} map={Config.map} />
)

MapContainer.propTypes = Map.propTypes

MapContainer.displayName = 'MapContainer'

export default MapContainer
