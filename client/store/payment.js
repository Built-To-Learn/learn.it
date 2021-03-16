import axios from 'axios'
const GENERATE_SIGNUP = "GENERATE_SIGNUP"
const SET_MERCHANT = "SET_MERCHANT"

const generateSignup = (links) => ({
  type: GENERATE_SIGNUP,
  links
})

const _setMerchant = (merchant) => ({
  type: SET_MERCHANT,
  merchant
})

export const setMerchant = (trackingId) => async (dispatch) => {
  const {token_type, access_token} = await getAccessCode()

  const body = {
    token_type,
    access_token
  }

  // needs Auth in req body
  const merchant = (await axios.post(`/auth/paypal/merchant/${trackingId}`,
  body)).data

  dispatch(_setMerchant(merchant))
}

const getAccessCode = async () => {
  const {token_type, access_token} = (await axios.get("/auth/paypal/token")).data
  return {token_type, access_token}
}

export const generateSignupLinks = (email, userid) => async (dispatch) => {
  // check if we have an access code - otherwise get one ????
  const {token_type, access_token} = await getAccessCode()

  // Builds a "relationship" between us the partner and the seller (client)
  const url = 'https://api-m.sandbox.paypal.com/v2/customer/partner-referrals'
  const bodyParams = {
    "tracking_id": userid,
    "operations": [
      {
        "operation": "API_INTEGRATION",
        "api_integration_preference": {
          "rest_api_integration": {
            "integration_method": "PAYPAL",
            "integration_type": "THIRD_PARTY",
            "third_party_details": {
              "features": [
                "PAYMENT",
                "REFUND"
             ]
            }
          }
        }
      }
    ],
    "products": [
      "EXPRESS_CHECKOUT"
    ],
    "legal_consents": [
      {
        "type": "SHARE_DATA_CONSENT",
        "granted": true
      }
    ],
    "email": email,
    // "partner_config_override": {
    //   "return_url": "http://www.learnit-test.com/paypal/return"
    // }
  }

  const config = {
    headers: {
      Authorization: `${token_type} ${access_token}`,
      "Content-Type": "application/json"
    }
  }

  // Gets user specific signup link to fill button with using the above objects
  const {links} = (await axios.post(
    'https://api-m.sandbox.paypal.com/v2/customer/partner-referrals',
    bodyParams,
    config
  )).data

  // Dispatch the links to the store to use on componenets button
  dispatch(generateSignup(links))
}

const initState = {
  merchant:{
    merchantId: null,
    payments_receivable: false,
    primary_email_confirmed: false
  }

}

export default function(state = initState, action){
  switch(action.type){
    case GENERATE_SIGNUP:
      return {...state, links: [...action.links]}
    case SET_MERCHANT:
      return { ...state, merchant: {...action.merchant}}
    default:
      return state
  }
}
