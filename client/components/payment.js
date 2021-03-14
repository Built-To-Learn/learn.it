import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { generateSignupLinks, setMerchant } from "../store"

const Payment = ({paypalSignup, payment, auth}) => {
  useEffect(() => {
    const init = async () => {
      await paypalSignup(auth.email, auth.id)
    }

    init()
  }, [])

  return(
    <div>
      <a target="_blank" className={ !payment.links ? "disabled btn" : "btn" }  href={!payment.links ? "" : payment.links[1].href}>
        Link Paypal
      </a>
      {/* <p>{ !primary_email_confirmed ? 'please verify primary email' : ''}</p> */}
    </div>
  )
}

const mapState = ({payment, auth}) => {
  return {
      payment,
      auth
  }
}

const mapDispatch = (dispatch) => {
  return {
      paypalSignup(email, userid){
        dispatch(generateSignupLinks(email, userid))
      },
  }
}

export default connect(mapState, mapDispatch)(Payment)
