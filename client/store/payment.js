import axios from 'axios'
const GENERATE_SIGNUP = "GENERATE_SIGNUP"
const SET_BALANCE = "SET_BALANCE"

const generateSignup = (onboardUrl) => ({
  type: GENERATE_SIGNUP,
  onboardUrl
})

const _setBalance = (balance) => ({
  type: SET_BALANCE,
  balance
})

export const generateAccountLinks = (stripeAcc) => async (dispatch) => {
  const { url } = (await axios.post('/auth/stripe/accountlink', { stripeAcc })).data
  dispatch(generateSignup(url))
}

export const checkAccStatus = async (stripeAcc) => {
  const {charges_enabled} = (await axios.get(`/auth/stripe/${stripeAcc}`)).data
  return charges_enabled
}

export const setBalance = (stripeAcc) => async (dispatch) => {
  const balance = {
    available: 0,
    instant: 0,
    pending: 0
  }
  const rawBalance = (await axios.get(`/auth/stripe/balance/${stripeAcc}`)).data
  rawBalance.available.forEach(bal => {
    balance.available += bal.amount*1 / 100
  })
  rawBalance.instant_available.forEach(bal => {
    balance.instant += bal.amount*1 / 100
  })
  rawBalance.pending.forEach(bal => {
    balance.pending += bal.amount*1 / 100
  })

  dispatch(_setBalance(balance))
}

const initState = {
  onboardUrl: "",
  balance: {
    available: 0,
    instant: 0,
    pending: 0
  }
}

export default function(state = initState, action){
  switch(action.type){
    case GENERATE_SIGNUP:
      return {...state, onboardUrl: action.onboardUrl}
    case SET_BALANCE:
      return {...state, balance: action.balance}
    default:
      return state
  }
}
