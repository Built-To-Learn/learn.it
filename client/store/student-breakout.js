/**
 * ACTION TYPES
 */
const SET_STUDENT_BREAKOUT = 'SET_STUDENT_BREAKOUT';
const CLEAR_STUDENT_BREAKOUT = 'CLEAR_STUDENT_BREAKOUT';

/**
 * ACTION CREATORS
 */
const setStudentBreakout = (room) => ({
  type: SET_STUDENT_BREAKOUT,
  room,
});

const clearStudentBreakout = () => ({
  type: CLEAR_STUDENT_BREAKOUT,
});

/**
 * THUNK CREATORS
 */
//
export const fetchStudentBreakout = (room) => async (dispatch) => {
  return dispatch(setStudentBreakout(room));
};

export const fetchClearStudentBreakout = () => async (dispatch) => {
  return dispatch(clearStudentBreakout());
};

/**
 * REDUCER
 */
const initialState = { active: false, room: '' };
export default function (state = initialState, action) {
  switch (action.type) {
    case SET_STUDENT_BREAKOUT:
      return { active: true, room: action.room };
    case CLEAR_STUDENT_BREAKOUT:
      return initialState;
    default:
      return state;
  }
}
