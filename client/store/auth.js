import axios from 'axios';
import history from '../history';

const storage = () => window.localStorage;
const TOKEN = 'token';

/**
 * ACTION TYPES
 */
const SET_AUTH = 'SET_AUTH';

/**
 * ACTION CREATORS
 */
const setAuth = (auth) => ({ type: SET_AUTH, auth });

/**
 * THUNK CREATORS
 */
export const me = () => async (dispatch) => {
  const token = storage().getItem(TOKEN);
  if (token) {
    const res = await axios.get('/auth/me', {
      headers: {
        authorization: token,
      },
    });
    return dispatch(setAuth(res.data));
  }
};

export const authenticate = (
  method,
  email,
  password,
  fullname,
  username
) => async (dispatch) => {
  let res;
  try {
    if (method === 'login') {
      res = await axios.post(`/auth/${method}`, { email, password });
    }

    if (method === 'signup') {
      console.log('INSIDE SIGNUP!');
      console.log(fullname, username);
      res = await axios.post(`/auth/${method}`, {
        email,
        password,
        name: fullname,
        username,
      });
    }

    storage().setItem(TOKEN, res.data.token);
    dispatch(me());
  } catch (authError) {
    return dispatch(setAuth({ error: authError }));
  }
};

export const logout = () => {
  storage().removeItem(TOKEN);
  history.push('/login');
  return {
    type: SET_AUTH,
    auth: {},
  };
};

export const updateUserInfo = (userId, user) => async (dispatch) => {
  await axios.put(`/api/users/${userId}`, user)
  dispatch(me())
}

/**
 * REDUCER
 */
export default function (state = {}, action) {
  switch (action.type) {
    case SET_AUTH:
      return action.auth;
    default:
      return state;
  }
}
