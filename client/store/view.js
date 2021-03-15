/**
 * ACTION TYPES
 */
const SET_VIEW = 'SET_VIEW';
const CLEAR_VIEW = 'CLEAR_VIEW';

/**
 * ACTION CREATORS
 */
const setView = (view) => ({
  type: SET_VIEW,
  view,
});

const clearView = () => ({
  type: CLEAR_VIEW,
});

/**
 * THUNK CREATORS
 */
//
export const fetchView = (view) => async (dispatch) => {
  return dispatch(setView(view));
};

export const fetchClearView = () => async (dispatch) => {
  return dispatch(clearView());
};

/**
 * REDUCER
 */
const initialState = { view: '' };
export default function (state = initialState, action) {
  switch (action.type) {
    case SET_VIEW:
      return action.view;
    case CLEAR_VIEW:
      return { view: '' };
    default:
      return state;
  }
}
