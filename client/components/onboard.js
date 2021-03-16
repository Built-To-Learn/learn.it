import React, { useEffect } from 'react'
import { connect } from 'react-redux'

const Onboard = ({payment}) => {
  const { merchant } = payment
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
        href={!payment.links ? "" : payment.links[1].href}>
          Link Paypal
        </a>
      </div>
    )
  }
}

const mapState = ({payment}) => {
  return {
      payment,
  }
}

export default connect(mapState)(Onboard)
