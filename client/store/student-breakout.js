/**
 * ACTION TYPES
 */
const SET_STUDENT_BREAKOUT = 'SET_STUDENT_BREAKOUT';
const CLEAR_STUDENT_BREAKOUT = 'CLEAR_STUDENT_BREAKOUT';
const SET_RETURN_TO_MAIN = 'SET_RETURN_TO_MAIN';

const FINAL_RETURN = 'FINAL_RETURN';

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

const setReturnToMain = (data) => ({
  type: SET_RETURN_TO_MAIN,
  data,
});

const setFinalReturn = () => ({
  type: FINAL_RETURN,
});

/**
 * THUNK CREATORS
 */
//
export const fetchStudentBreakout = (room) => (dispatch) => {
  return dispatch(setStudentBreakout(room));
};

export const fetchClearStudentBreakout = () => (dispatch) => {
  return dispatch(clearStudentBreakout());
};

export const fetchReturnToMain = (room, type) => (dispatch) => {
  return dispatch(setReturnToMain({ room: room, type: type }));
};

export const fetchFinalReturn = () => (dispatch) => {
  return dispatch(setFinalReturn());
};

/**
 * REDUCER
 */
const initialState = { active: false, room: '', return: false, type: '' };
export default function (state = initialState, action) {
  switch (action.type) {
    case SET_STUDENT_BREAKOUT:
      return { active: true, room: action.room, return: false, type: '' };
    case SET_RETURN_TO_MAIN:
      return {
        ...state,
        return: true,
        room: action.data.room,
        type: action.data.type,
      };
    case FINAL_RETURN:
      return {
        ...state,
        active: false,
      };
    case CLEAR_STUDENT_BREAKOUT:
      return initialState;
    default:
      return state;
  }
}
