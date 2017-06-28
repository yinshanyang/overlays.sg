import React from 'react'
import PropTypes from 'prop-types'

import MapGL from '../common/MapGL'

const Map = ({ map, children }) => (
  <MapGL {...map}>
    {children}
  </MapGL>
)

Map.propTypes = {
  map: PropTypes.object,
  children: PropTypes.any
}

Map.displayName = 'Map'

export default Map
