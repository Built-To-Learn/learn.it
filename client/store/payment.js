import axios from 'axios'
const GENERATE_SIGNUP = "GENERATE_SIGNUP"


const generateSignup = (links) => ({
  type: GENERATE_SIGNUP,
  links
})

export const generateAccountLinks = (stripeAcc) => async (dispatch) => {
  const links = await axios.post('/auth/stripe/accountlink', {
    stripeAcc
  })

  console.log(links)
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
    default:
      return state
  }
}
