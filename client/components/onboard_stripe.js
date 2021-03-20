import React, { useEffect } from 'react'
import { connect } from 'react-redux'

const StripeOnboard = () => {
  return (
    <div>
      Stripe Onboard
    </div>
  )
}

const mapState = (state) => {
  return {
      state,
  }
}

export default connect(mapState)(StripeOnboard)
