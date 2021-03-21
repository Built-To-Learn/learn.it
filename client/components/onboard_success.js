import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { updateUserInfo, checkAccStatus } from "../store"
import { Link } from "react-router-dom"

const SuccessfulOnboard = ({auth, updateOnboard}) => {
  useEffect(()=> {
    if(!auth.onboarded){
      updateOnboard(auth.stripeAcc, auth.id)
    }
  }, [])

  if(!auth.onboarded){
    return(
      <div className="section container center">
        <h3>Please finish setting up stripe</h3>
      </div>
    )
  }else{
    return(
      <div className="section container center">
        <h3>Stripe Successfully Linked</h3>
        <Link to="/"> Home </Link>
      </div>
    )
  }

}

const mapState = ({auth}) => {
  return {
      auth
  }
}

const mapDispatch = (dispatch) => {
  return {
      async updateOnboard(accId, userId){
        // check stripe account status
        const charges = await checkAccStatus(accId)
        if(charges){
          dispatch(updateUserInfo(userId, { onboarded: true } ))
        }
      }
  }
}

export default connect(mapState, mapDispatch)(SuccessfulOnboard)
