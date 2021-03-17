import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchView } from '../store/view';
import { generateSignupLinks, setMerchant } from "../store"


const AccountInfoBtn = ({auth, payment, buildSignups, fetchView}) => {

  useEffect(() => {
    buildSignups(auth.email, auth.id, payment.merchant.merchantId)
  }, [])

  return (
    <div
        id="account_info"
        className="account_info_btn valign-wrapper"
        onClick={() => fetchView('accountInfo')}
    >
        <i className="small material-icons">account_circle</i>
        <span>Account Info</span>
    </div>
  )
}

const mapState = ({payment, auth}) => {
  return {
      payment,
      auth
  }
}

export default connect(mapState, (dispatch) => {
  return {
    fetchView: (view) => dispatch(fetchView(view)),
    buildSignups: async (email, userid, merchantId) => {
      if(merchantId === null){
        try {
          // check if we have a merchant
          await dispatch(setMerchant(userid))
        } catch (error) {
          // if that fails we generate signup links
          await dispatch(generateSignupLinks(email, userid))
        }
      }
    }
  };
})(AccountInfoBtn);
