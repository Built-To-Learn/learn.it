import axios from 'axios'
const GENERATE_SIGNUP = "GENERATE_SIGNUP"

const generateSignup = (links) => ({
  type: GENERATE_SIGNUP,
  links
})

export const getPaypalLinks = (email, userid) => async (dispatch) => {
  const {token_type, access_token} = (await axios.get("/auth/paypaltoken")).data
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
  const {links} = (await axios.post(url, bodyParams, config)).data
  dispatch(generateSignup(links))
}

const initState = {}
export default function(state = initState, action){
  switch(action.type){
    case GENERATE_SIGNUP:
      return {...state, links: [...action.links]}
    default:
      return state
  }
}
