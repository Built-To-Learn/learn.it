import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
const FailedOnboard = (state) => {
  return(
    <div className="container section center">
      <h1>Stripe failed oh no :(</h1>
      <Link to="/home">Return Home</Link>
    </div>
  )
}

const mapState = (state) => {
  return {
      state,
  }
}

export default connect(mapState)(FailedOnboard)
