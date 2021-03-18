import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchView } from '../store/view';
import { generateSignupLinks, setMerchant } from "../store"
import { CollapsibleItem, Icon } from 'react-materialize';


const Settings = ({auth, payment, buildSignups, fetchView}) => {

  useEffect(() => {
    buildSignups(auth.email, auth.id, payment.merchant.merchantId)
  }, [])

  return (
    <CollapsibleItem
      expanded={false}
      header="Settings"
      icon={<Icon>settings</Icon>}
      node="div"
      onSelect={() => {}}>

      <div
        id="account_info"
        className="account_info_btn valign-wrapper"
        onClick={() => fetchView('accountInfo')}>
        <i className="small material-icons">account_circle</i>
        <span>Account Info</span>
      </div>

    </CollapsibleItem>

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
})(Settings);
