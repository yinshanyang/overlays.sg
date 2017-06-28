import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { setSelection, fetchPoints, fetchData } from '../../actions'
import { getSelection, getData, getAreas } from '../../selectors'

import Overlay from '../Overlay'

class OverlayContainer extends PureComponent {
  componentDidMount () {
    this.props.onMount()
  }

  render () {
    return (
      <Overlay {...this.props} />
    )
  }
}

OverlayContainer.propTypes = Overlay.propTypes

OverlayContainer.displayName = 'OverlayContainer'

const mapStateToProps = (state) => ({
  selection: getSelection(state),
  data: getData(state),
  areas: getAreas(state)
})

const mapDispatchToProps = (dispatch) => ({
  onMount: () => {
    dispatch(fetchPoints())
    // FIXME: this is a hack to get the initial load of Raffles MRT
    dispatch(fetchData(12390))
  },
  onChange: (point) => dispatch(setSelection(point))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OverlayContainer)
