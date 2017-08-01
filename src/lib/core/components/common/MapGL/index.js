import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import mapboxgl from 'mapbox-gl'

import * as styles from './styles.css'

class MapGL extends PureComponent {
  mapElement = null

  componentDidMount () {
    const {apiKey, mapStyle, bbox, center, fit, zoom, minZoom, maxZoom} = this.props
    mapboxgl.accessToken = apiKey

    this.mapElement = new mapboxgl.Map({
      container: findDOMNode(this.refs.map),
      style: mapStyle,
      maxBounds: bbox,
      center,
      zoom,
      minZoom,
      maxZoom,
      attributionControl: false,
      pitch: 42
    })

    this.mapElement.dragRotate.disable()
    this.mapElement.touchZoomRotate.disableRotation()

    this.mapElement.on('load', () => {
      this.mapElement.setLight({
        anchor: 'viewport',
        intensity: 0.4,
        position: [
          1.5,
          210,
          30
        ]
      })
    })

    if (fit) this.mapElement.fitBounds(fit, {padding: 10})

    this.forceUpdate()
    setTimeout(() => this.mapElement.resize(), 0)
  }

  componentWillUpdate (nextProps) {
    if (this.props.mapStyle !== nextProps.mapStyle) {
      this.mapElement.setStyle(nextProps.mapStyle)
    }
  }

  componentWillUnmount () {
    this.mapElement.remove()
  }

  render () {
    const map = this.mapElement
    const children = map
      ? React.Children.map(this.props.children, (child) => (
        child ? React.cloneElement(child, { map, layerContainer: map }) : null
      ))
      : null

    return (
      <div ref='map' className={styles.map}>
        {children}
      </div>
    )
  }
}

MapGL.defaultProps = {
  center: [0, 0],
  zoom: 5,
  minZoom: 1,
  maxZoom: 20,
  bbox: [[-180, -90], [180, 90]],
  mapStyle: 'mapbox://styles/mapbox/dark-v9'
}

MapGL.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element
  ]),
  apiKey: PropTypes.string.isRequired,
  center: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  mapStyle: PropTypes.string,
  fit: PropTypes.arrayOf(PropTypes.array),
  bbox: PropTypes.arrayOf(PropTypes.array)
}

MapGL.displayName = 'MapGL'

export default MapGL
export { MapGL }
