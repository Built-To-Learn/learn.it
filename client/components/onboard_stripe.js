import React, { useEffect } from 'react'
import { connect } from 'react-redux'

const StripeOnboard = ({auth, payment}) => {
  if(auth.onboarded){
    return (
      <div>
        <a className="btn disabled">Stripe Linked</a>
      </div>
    )
  }

  if(payment.onboardUrl){
    return (
      <div>
        <a className="btn" href={payment.onboardUrl}>Link Stripe</a>
      </div>
    )
  }else{
    return (
      <div>
        <a className="btn disabled" >Link Stripe</a>
      </div>
    )
  }

}

const mapState = ({auth, payment}) => {
  return {
      auth,
      payment
  }
}

export default connect(mapState)(StripeOnboard)
