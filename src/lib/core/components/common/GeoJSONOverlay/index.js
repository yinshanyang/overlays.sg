import { PureComponent } from 'react'
import PropTypes from 'prop-types'

// passable unique ID hack
const uid = () => Math.random().toString(32).slice(2)

class GeoJSONOverlay extends PureComponent {
  id = null
  attached = false
  layer = {}

  componentDidMount () {
    const { id } = this.props
    this.id = id || uid()
    this.forceUpdate()
  }

  componentDidUpdate () {
    this.waitForLoaded()
  }

  componentWillUnmount () {
    const { map } = this.props
    const { ids } = this.layer
    if (!map || !map.style) return
    if (map.getSource(ids.source)) map.removeSource(ids.source)
    if (map.getLayer(ids.layer)) map.removeLayer(ids.layer)
  }

  render () {
    return null
  }

  waitForLoaded = () => {
    const { map } = this.props
    if (!map.loaded()) return setTimeout(this.waitForLoaded, 300)
    if (!this.attached) {
      this.attached = true
      this.attach()
    }
    this.redraw()
  }

  redraw = (msg) => {
    const { map, data, type, layout, paint, before } = this.props

    this.layer = {
      data,
      ids: {
        source: `${this.id}-data`,
        layer: this.id
      }
    }

    if (!map.getSource(this.layer.ids.source)) {
      map
        .addSource(this.layer.ids.source, {
          type: 'geojson',
          data: this.layer.data
        })
        .addLayer({
          source: this.layer.ids.source,
          id: this.layer.ids.layer,
          type,
          paint,
          layout
        }, before)
    } else {
      map
        .getSource(this.layer.ids.source)
        .setData(this.layer.data)
    }
  }

  attach = () => {
    const { map, onFeatureClick, onFeatureHover } = this.props
    if (onFeatureClick) map.on('click', this.handleClick)
    if (onFeatureHover) map.on('mousemove', this.handleHover)
  }

  handleClick = (evt) => {
    if (!this.id) return
    const { map, onFeatureClick } = this.props
    const [ feature ] = map.queryRenderedFeatures(evt.point, {layers: [this.id]})
    if (feature) return onFeatureClick(feature.properties)
  }

  handleHover = (evt) => {
    if (!this.id) return
    const { map, onFeatureHover } = this.props
    const [ feature ] = map.queryRenderedFeatures(evt.point, {layers: [this.id]})
    if (feature) return onFeatureHover(feature.properties)
    return onFeatureHover(null)
  }
}

GeoJSONOverlay.defaultProps = {
  data: {},
  type: 'circle',
  layout: {},
  paint: {},
  onFeatureClick: null,
  onFeatureHover: null
}

GeoJSONOverlay.propTypes = {
  map: PropTypes.object,
  id: PropTypes.string,
  data: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  type: PropTypes.string,
  layout: PropTypes.object,
  paint: PropTypes.object,
  before: PropTypes.string,
  onFeatureClick: PropTypes.func,
  onFeatureHover: PropTypes.func
}

GeoJSONOverlay.displayName = 'GeoJSONOverlay'

export default GeoJSONOverlay
export { GeoJSONOverlay }
