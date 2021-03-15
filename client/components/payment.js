import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { generateSignupLinks, setMerchant } from "../store"

const Payment = ({paypalBootstrap, payment, auth}) => {
  const { merchant } = payment

  useEffect(() => {
    paypalBootstrap(auth.email, auth.id, merchant.merchantId)
  }, [])

  if(merchant.payments_receivable){
    return(
      <div>
        <a className="btn disabled">
          {merchant.primary_email_confirmed
            ? "Paypal Linked"
            : "Finish Paypal Setup"
          }
        </a>
      </div>
    )

  }else{
    return (
      <div>
        <a
        className={!payment.links ? "btn disabled s12" : "btn s12"}
        target="_blank"
        href={!payment.links ? "" : payment.links[1].href}>
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
      async paypalBootstrap(email, userid, merchantId){
        if(merchantId === null){
          await dispatch(generateSignupLinks(email, userid))
          await dispatch(setMerchant(userid))
        }
      },
  }
}

export default connect(mapState, mapDispatch)(Payment)
