/**
 * ACTION TYPES
 */
const SET_ROOM = 'SET_ROOM';
const CLEAR_ROOM = 'CLEAR_ROOM';

/**
 * ACTION CREATORS
 */
const setRoom = (data) => ({
  type: SET_ROOM,
  data,
});

const clearRoom = () => ({
  type: CLEAR_ROOM,
});

/**
 * THUNK CREATORS
 */
//
export const fetchRoom = (data) => async (dispatch) => {
  return dispatch(setRoom(data));
};

export const fetchClearRoom = () => async (dispatch) => {
  return dispatch(clearRoom());
};

/**
 * REDUCER
 */
const initialState = { room: '', type: '', teacher: '' };
export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ROOM:
      return action.data;
    case CLEAR_ROOM:
      return initialState;
    default:
      return state;
  }
}
