import axios from 'axios'
const GENERATE_SIGNUP = "GENERATE_SIGNUP"


const generateSignup = (onboardUrl) => ({
  type: GENERATE_SIGNUP,
  onboardUrl
})

export const generateAccountLinks = (stripeAcc) => async (dispatch) => {
  const { url } = (await axios.post('/auth/stripe/accountlink', { stripeAcc })).data
  dispatch(generateSignup(url))
}

export const checkAccStatus = async (stripeAcc) => {
  const {charges_enabled} = (await axios.get(`/auth/stripe/${stripeAcc}`)).data
  return charges_enabled
}

const initState = {
  onboardUrl: ""
}

export default function(state = initState, action){
  switch(action.type){
    case GENERATE_SIGNUP:
      return {onboardUrl: action.onboardUrl}
    default:
      return state
  }
}
