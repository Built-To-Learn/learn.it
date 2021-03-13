/**
 * ACTION TYPES
 */
const SET_BREAKOUT = 'SET_BREAKOUT';
const CLEAR_BREAKOUT = 'CLEAR_BREAKOUT';

/**
 * ACTION CREATORS
 */
const setBreakout = (data) => ({
  type: SET_BREAKOUT,
  data,
});

const clearBreakout = () => ({
  type: CLEAR_BREAKOUT,
});

/**
 * THUNK CREATORS
 */
//
export const fetchBreakout = (data) => async (dispatch) => {
  return dispatch(setBreakout(data));
};

export const fetchClearBreakout = () => async (dispatch) => {
  return dispatch(clearBreakout());
};

/**
 * REDUCER
 */
const initialState = { active: false, rooms: {} };
export default function (state = initialState, action) {
  switch (action.type) {
    case SET_BREAKOUT:
      return action.data;
    case CLEAR_BREAKOUT:
      return initialState;
    default:
      return state;
  }
}
