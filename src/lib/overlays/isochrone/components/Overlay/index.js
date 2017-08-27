import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import GeoJSONOverlay from '../../../../core/components/common/GeoJSONOverlay'

// green
// const colors = ['#343332', '#34573c', '#407a55', '#5b9b78', '#81bca0', '#b2dbcd', '#edf8fb']

// green-alt
// const colors = ['#343332', '#35593d', '#467b4f', '#669e66', '#8fc183', '#c1e1a4', '#ffffcc']

// blue
const colors = ['#343332', '#424e7a', '#56729a', '#7395af', '#97babe', '#c5ddc7', '#ffffcc']

// purple
// const colors = ['#343332', '#793766', '#a64d84', '#cb6c9c', '#e692b3', '#f9bcc9', '#feebe2']

// purple-alt
// const colors = ['#343332', '#6a416e', '#866094', '#9d84b3', '#b4abce', '#cdd1e6', '#edf8fb']

const configs = {
  contours: {
    id: 'contours',
    before: 'water',
    type: 'circle',
    paint: {
      'circle-radius': 4,
      'circle-color': {
        property: 'value',
        stops: [
          [0, colors[0]],
          [0.25, colors[1]],
          [0.5, colors[2]],
          [0.75, colors[3]],
          [1, colors[4]]
        ]
      }
    }
  }
}

class Overlay extends PureComponent {
  renderArea = ({ time, area }, index) => (
    <div key={index}>
      <label>{time} min</label>
      <div>
        <div style={{background: colors[index], width: `${area * 70}%`}} />
        <span>{Math.round(area * 1000) / 10}%</span>
      </div>
    </div>
  )

  render () {
    const { map, data } = this.props
    // continuous heatmap
    const max = data.features.map((feature) => feature.properties.value).reduce((a, b) => Math.max(a, b), 0)
    const stops = colors.map((color, index) => [index / (colors.length - 1) * max, color])

    // threshold heatmap
    // const max = data.features.map((feature) => feature.properties.value).reduce((a, b) => Math.max(a, b), 0)
    // data.features.map((feature) => { feature.properties.value = ~~(feature.properties.value / max * colors.length) * max / colors.length })
    // const stops = colors.map((color, index) => [index * max / colors.length, color])

    configs.contours.paint['circle-color'].stops = stops

    return (
      <div>
        <GeoJSONOverlay map={map} data={data} {...configs.contours} />
      </div>
    )
  }

  handleChange = ({ location }) => {
    this.props.onChange([location.lng, location.lat])
    this.refs.geocoder.blur()
  }

  handleClear = () => {
    this.props.onChange(null)
    this.refs.geocoder.clear()
  }
}

Overlay.propTypes = {
  ...GeoJSONOverlay.propTypes,
  selection: PropTypes.object,
  data: PropTypes.object,
  areas: PropTypes.arrayOf(PropTypes.object),
  onMount: PropTypes.func,
  onChange: PropTypes.func
}

Overlay.displayName = 'Overlay'

export default Overlay
