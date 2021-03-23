import React from 'react'
import { connect } from 'react-redux'

const Earnings = ({auth, payment, handleClick}) => {

  return(
    <div className="">
      <button className="btn" onClick={() => handleClick()}>
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
      async handleClick(){

      }
  }
}

export default connect(mapState, mapDispatch)(Earnings)
