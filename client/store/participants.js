import axios from 'axios';

/**
 * ACTION TYPES
 */
const ADD_PEER = 'ADD_PEER';
const REMOVE_PEER = 'REMOVE_PEER';
const CLEAR_PEER = 'CLEAR_PEER';

/**
 * ACTION CREATORS
 */
const setPeer = (peer) => ({
  type: ADD_PEER,
  peer,
});

const removePeer = (peer) => ({
  type: REMOVE_PEER,
  peer,
});

const clearPeer = () => ({
  type: CLEAR_PEER,
});

/**
 * THUNK CREATORS
 */
//
export const fetchAddPeer = (peer) => async (dispatch) => {
  return dispatch(setPeer(peer));
};

export const fetchRemovePeer = (peer) => async (dispatch) => {
  return dispatch(removePeer(peer));
};

export const fetchClearPeer = () => async (dispatch) => {
  return dispatch(clearPeer());
};

/**
 * REDUCER
 */

const initialState = [];
export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_PEER:
      const temp = state.filter((item) => item.id === action.peer.id);
      if (temp.length === 0) return [...state, action.peer];
      return state;
    case REMOVE_PEER:
      return state.filter((peer) => peer.id !== action.peer);
    case CLEAR_PEER:
      return initialState;
    default:
      return state;
  }
}
