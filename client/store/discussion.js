import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_DISCUSSION = 'SET_DISCUSSION';
const CLEAR_DISCUSSION = 'CLEAR_DISCUSSION';
const ADD_DISCUSSION = 'ADD_DISCUSSION';
const EDIT_DISCUSSION = 'EDIT_DISCUSSION';
const DELETE_DISCUSSION = 'DELETE_DISCUSSION';

const ADD_EXTERNAL_DISCUSSION = 'ADD_EXTERNAL_DISCUSSION';
const EDIT_EXTERNAL_DISCUSSION = 'EDIT_EXTERNAL_DISCUSSION';
const DELETE_EXTERNAL_DISCUSSION = 'DELETE_EXTERNAL_DISCUSSION';

/**
 * ACTION CREATORS
 */
const setDiscussion = (discussion) => ({
  type: SET_DISCUSSION,
  discussion,
});

const addDiscussion = (discussion) => ({
  type: ADD_DISCUSSION,
  discussion,
});

const addExternalDiscussion = (discussion) => ({
  type: ADD_EXTERNAL_DISCUSSION,
  discussion,
});

const editExternalDiscussion = (discussion) => ({
  type: EDIT_EXTERNAL_DISCUSSION,
  discussion,
});

const clearDiscussion = () => ({
  type: CLEAR_DISCUSSION,
});

const editDiscussion = (discussion) => ({
  type: EDIT_DISCUSSION,
  discussion,
});

const deleteDiscussion = (id) => ({
  type: DELETE_DISCUSSION,
  id,
});

const deleteExternalDiscussion = (id) => ({
  type: DELETE_EXTERNAL_DISCUSSION,
  id,
});

/**
 * THUNK CREATORS
 */
//
export const fetchDiscussion = (course) => async (dispatch) => {
  //axios call
  const discussion = (await axios.get(`/api/discussion/${course.id}`)).data;

  return dispatch(setDiscussion({ course: course, discussion: discussion }));
};

export const fetchClearDiscussion = () => async (dispatch) => {
  return dispatch(clearDiscussion());
};

export const fetchAddExternalDiscussion = (discussion) => (dispatch) => {
  return dispatch(addExternalDiscussion(discussion));
};

export const fetchEditExternalDiscussion = (discussion) => (dispatch) => {
  return dispatch(editExternalDiscussion(discussion));
};

export const fetchDeleteExternalDiscussion = (id) => (dispatch) => {
  return dispatch(deleteExternalDiscussion(id));
};

export const fetchAddDiscussion = (discussion, socket) => async (dispatch) => {
  //axios call
  const token = window.localStorage.getItem('token');
  if (token) {
    const _discussion = (
      await axios.post(`/api/discussion`, discussion, {
        headers: {
          authorization: token,
        },
      })
    ).data;

    socket.emit(
      'discussionMessage',
      `discussion-${discussion.courseId}`,
      _discussion
    );
    return dispatch(addDiscussion(_discussion));
  }
};

export const fetchDeleteDiscussion = (discussion, socket) => async (
  dispatch
) => {
  const token = window.localStorage.getItem('token');
  if (token) {
    await axios.delete(`/api/discussion/${discussion.id}`, {
      headers: {
        authorization: token,
      },
    });

    socket.emit(
      'deleteDiscussionMessage',
      `discussion-${discussion.courseId}`,
      discussion.id
    );
    return dispatch(deleteDiscussion(discussion.id));
  }
};

export const fetchEditDiscussion = (discussion, socket) => async (dispatch) => {
  const token = window.localStorage.getItem('token');

  if (token) {
    const res = (
      await axios.put(
        `/api/discussion`,
        { text: discussion.text, postId: discussion.id },
        {
          headers: {
            authorization: token,
          },
        }
      )
    ).data;
    socket.emit(
      'discussionMessageEdit',
      `discussion-${discussion.courseId}`,
      discussion
    );

    return dispatch(editDiscussion(res));
  }
};

/**
 * REDUCER
 */
const initialState = { course: {}, discussion: [] };
export default function (state = initialState, action) {
  switch (action.type) {
    case SET_DISCUSSION:
      return action.discussion;
    case ADD_DISCUSSION:
      return { ...state, discussion: [...state.discussion, action.discussion] };
    case DELETE_DISCUSSION:
      return {
        ...state,
        discussion: state.discussion.filter((el) => el.id !== action.id),
      };
    case DELETE_EXTERNAL_DISCUSSION:
      return {
        ...state,
        discussion: state.discussion.filter((el) => el.id !== action.id),
      };

    case EDIT_DISCUSSION:
      return {
        ...state,
        discussion: state.discussion.map((el) =>
          el.id === action.discussion.id ? action.discussion : el
        ),
      };
    case CLEAR_DISCUSSION:
      return initialState;
    case ADD_EXTERNAL_DISCUSSION:
      return { ...state, discussion: [...state.discussion, action.discussion] };
    case EDIT_EXTERNAL_DISCUSSION:
      return {
        ...state,
        discussion: state.discussion.map((el) =>
          el.id === action.discussion.id ? action.discussion : el
        ),
      };
    default:
      return state;
  }
}
