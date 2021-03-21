import React, { useEffect } from 'react'
import { connect } from 'react-redux'

const FailedOnboard = (state) => {
  return(
    <div>
      <h1>Stripe failed oh no :(</h1>
    </div>
  )
}

const mapState = (state) => {
  return {
      state,
  }
}

export default connect(mapState)(FailedOnboard)
