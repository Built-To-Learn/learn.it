import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

const Earnings = ({auth, payment, handleClick}) => {

  return(
    <div className="">
      <button className="btn" onClick={() => handleClick(payment.balance.available, auth.stripeAcc)}>
        Available: ${payment.balance.available}
      </button>


      <p>You currently have ${payment.balance.pending} pending</p>
    </div>
  )

}

const mapState = ({auth, payment}) => {
  return {
      auth,
      payment
  }
}

const mapDispatch = (dispatch) => {
  return {
      async handleClick(amount, acc){
        await axios.post(`/auth/stripe/payout/${acc}`, {amount: amount * 100})
        await dispatch(setBalance(acc))
      }
  }
}

export default connect(mapState, mapDispatch)(Earnings)
