import React from 'react'
import { Link } from "react-router-dom"

const SuccessfulOnboard = ({auth, payment, updateMerchantId}) => {
  return(
    <div className="container section center">
      <h1>Congrats!</h1>
      <p>You are now linked with paypal!</p>
      <Link to="/home">Home</Link>
    </div>
  )
}

export default SuccessfulOnboard
