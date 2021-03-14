import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { generateSignupLinks, setMerchant } from "../store"

const Payment = ({paypalBootstrap, payment, auth}) => {
  useEffect(() => {
    paypalBootstrap(auth.email, auth.id)
  }, [])

  if(payment.merchant.payments_receivable){
    return(
      <div>
        <a className="btn disabled">
          Paypal Account Linked
        </a>
      </div>
    )

  }else{
    return (
      <div>
        <a className="btn" target="_blank" href={!payment.links ? "" : payment.links[1].href}>
          Link Paypal
        </a>
      </div>
    )
  }
}

const mapState = ({payment, auth}) => {
  return {
      payment,
      auth
  }
}

const mapDispatch = (dispatch) => {
  return {
      async paypalBootstrap(email, userid){
        await dispatch(generateSignupLinks(email, userid))
        await dispatch(setMerchant(userid))
      },
  }
}

export default connect(mapState, mapDispatch)(Payment)
