import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import classNames from './styles.css'

import GeoJSONOverlay from '../../../../core/components/common/GeoJSONOverlay'
// import stations from '../../data/stations.geo.json'
// import query from '../../data/query.geo.json'
// import line from '../../data/line.geo.json'
import mask from '../../data/mask.geo.json'

// green
// const colors = ['#343332', '#34573c', '#407a55', '#5b9b78', '#81bca0', '#b2dbcd', '#edf8fb']

// green-alt (good for accessibility visualization)
// const colors = ['#343332', '#35593d', '#467b4f', '#669e66', '#8fc183', '#c1e1a4', '#ffffcc']

// blue
// const colors = ['#343332', '#424e7a', '#56729a', '#7395af', '#97babe', '#c5ddc7', '#ffffcc']

// purple
// const colors = ['#343332', '#793766', '#a64d84', '#cb6c9c', '#e692b3', '#f9bcc9', '#feebe2']

// purple-alt
// const colors = ['#343332', '#6a416e', '#866094', '#9d84b3', '#b4abce', '#cdd1e6', '#edf8fb']

// purple-orange
// const colors = ['#343332', '#7a3d56', '#a65960', '#cc7c6a', '#e9a47a', '#fdcf99', '#ffffd4']
const colors = ['#343332', '#773b5a', '#a4536b', '#c9757a', '#e69a8c', '#fac2a8', '#fef0d9']

// orange,  flames, everything is burning
// const colors = ['#343332', '#774325', '#a65d2a', '#cd7f3d', '#eba55e', '#fed08f', '#ffffd4']

const configs = {
  selection: {
    id: 'selection',
    type: 'circle',
    paint: {
      'circle-radius': 6,
      'circle-color': '#fff',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#343332'
    }
  },
  line: {
    id: 'line',
    type: 'line',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-width': 1,
      'line-color': '#fff',
      'line-opacity': 1
    }
  },
  stations: {
    id: 'stations',
    type: 'circle',
    paint: {
      'circle-radius': 2,
      'circle-color': '#fff',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#343332'
    }
  },
  mask: {
    id: 'mask',
    type: 'fill',
    paint: {
      'fill-color': '#191a1a'
    }
  },
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

const Legend = ({ label }) => ( // eslint-disable-line
  <div className={classNames.areas} style={{background: '#343332', color: '#fff', width: 232}}>
    <label style={{display: 'block', paddingBottom: 8, opacity: 0.7, clear: 'both'}}>Originating from <strong>{label}</strong>,<br />Time delay in minutes:</label>
    {
      colors
        .filter((_, index) => index > 0)
        .map((color, index) => (
          <div key={index} style={{display: 'block', float: 'left', textAlign: 'center', paddingRight: index === 5 ? 0 : 4}}>
            <div style={{width: 32, height: 8, background: color, marginBottom: 2}} />
            {(index + 1) * 5}
          </div>
        ))
    }
  </div>
)

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
    // const selection = 20
    // const values = data.features
    //   .map((feature) => +feature.properties.value)
    //   .filter((d) => d > 0)
    //   .sort((a, b) =>
    //     a > b
    //       ? 1
    //       : b < a
    //         ? -1
    //         : 0
    //   )

    // const max = values[values.length - 1]
    // const max = values[~~(values.length * 0.995)]
    // const max = 300 // max value for delta of all station breakdowns
    const max = 1800 // max value for IMPACT visualization

    // continuous heatmap
    // const stops = colors.map((color, index) => [index / (colors.length - 1) * max, color])

    // threshold heatmap
    data.features.map((feature) => {
      feature.properties.value = Math.min(feature.properties.value, max)
      feature.properties.value = Math.ceil(feature.properties.value / max * (colors.length - 1))
    })
    const stops = colors.map((color, index) => [index, color])

    configs.contours.paint['circle-color'].stops = stops

    return (
      <div>
        <GeoJSONOverlay map={map} data={data} {...configs.contours} />
        <GeoJSONOverlay map={map} data={mask} {...configs.mask} />
        <Legend />
      </div>
    )
    // <GeoJSONOverlay map={map} data={line} {...configs.line} />
    // <GeoJSONOverlay map={map} data={stations} {...configs.stations} />
    // <GeoJSONOverlay map={map} data={query.features[selection]} {...configs.selection} />
    // <Legend label={query.features[selection].properties.name} />
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
