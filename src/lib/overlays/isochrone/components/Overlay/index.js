import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import classNames from './styles.css'

import Geocoder from 'react-geosuggest'
import GeoJSONOverlay from '../../../../core/components/common/GeoJSONOverlay'

// const colors = ['#008000', '#447100', '#5f5f00', '#714c00', '#803300', '#8b0000']
// const colors = ['#009b00', '#8c8900', '#c76f00', '#ff3200']
// const colors = ['#a1dab4', '#41b6c4', '#2c7fb8', '#253494']
// const colors = ['#bae4bc', '#7bccc4', '#43a2ca', '#0868ac']
const colors = ['#f0f9e8', '#bae4bc', '#7bccc4', '#2b8cbe']
// const colors = ['#edf8b1', '#7fcdbb', '#1d91c0', '#0c2c84']
const configs = {
  contours: {
    id: 'contours',
    before: 'selection',
    type: 'fill-extrusion',
    // paint: {
    //   'line-color': {
    //     property: 'time',
    //     stops: [
    //       [0, colors[0]],
    //       [599.9, colors[0]],
    //       [600, colors[0]],
    //       [600.1, colors[1]],
    //       [1199.9, colors[1]],
    //       [1200, colors[1]],
    //       [1200.1, colors[2]],
    //       [1799.9, colors[2]],
    //       [1800, colors[2]],
    //       [1800.1, colors[3]],
    //       [2399.9, colors[3]],
    //       [2400, colors[3]],
    //       [2400.1, colors[4]],
    //       [2999.9, colors[4]],
    //       [3000, colors[4]],
    //       [3000.1, colors[5]],
    //       [3599.9, colors[5]],
    //       [3600, colors[5]]
    //     ]
    //   },
    //   'line-opacity': {
    //     property: 'time',
    //     stops: [
    //       [0, 1],
    //       [599.9, 0.2],
    //       [600, 1],
    //       [600.1, 0.2],
    //       [1199.9, 0.2],
    //       [1200, 1],
    //       [1200.1, 0.2],
    //       [1799.9, 0.2],
    //       [1800, 1],
    //       [1800.1, 0.2],
    //       [2399.9, 0.2],
    //       [2400, 1],
    //       [2400.1, 0.2],
    //       [2999.9, 0.2],
    //       [3000, 1],
    //       [3000.1, 0.2],
    //       [3599.9, 0.2],
    //       [3600, 1]
    //     ]
    //   }
    // }
    paint: {
      'fill-extrusion-color': {
        property: 'time',
        stops: [
          [0, colors[0]],
          [899.9, colors[0]],
          [900, colors[0]],
          [900.1, colors[1]],
          [1799.9, colors[1]],
          [1800, colors[1]],
          [1800.1, colors[2]],
          [2699.9, colors[2]],
          [2700, colors[2]],
          [2700.1, colors[3]],
          [3599.9, colors[3]],
          [3600, colors[3]]
        ]
      },
      'fill-extrusion-height': {
        property: 'time',
        stops: [
          [0, 36 * 120],
          [3600, 0]
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
    const { map, data, areas } = this.props
    const isEmpty = data.features.length === 0

    return (
      <div>
        <GeoJSONOverlay map={map} data={data} {...configs.contours} />
        <div className={classNames.geocoder}>
          <Geocoder
            ref='geocoder'
            placeholder='Search'
            initialValue='Raffles Place Singapore'
            country='sg'
            autoActivateFirstSuggest
            onSuggestSelect={this.handleChange}
          />
          <button
            className={[
              classNames.clear,
              isEmpty
                ? classNames.hidden
                : ''
            ].join(' ')}
            onClick={this.handleClear}
          >
           ×
          </button>
        </div>
        <div
          className={[
            classNames.areas,
            isEmpty
              ? classNames.hidden
              : ''
          ].join(' ')}
        >
          Percentage of Singapore accessible by public transport within:
          {areas.map(this.renderArea)}
        </div>
        <div className={classNames.attribution}>
          Made by <a href='https://swarm.is/'>Swarm</a>
        </div>
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
