import axios from 'axios'

const GENERATE_TOKEN = "GENERATE_TOKEN"


const generateToken = (token) => ({
  type: CREATE_COURSE,
  token,
})

export const getToken = () => async (dispatch) => {
  const token = await axios.get("/auth/paypaltoken")
  dispatch(generateToken(token))
}

export default function(state = {}, action){
  switch(action.type){
    case GENERATE_TOKEN:
      return action.token

    default:
      return state
  }
}
