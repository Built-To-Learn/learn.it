import axios from 'axios';

// Constants
const LOAD_QUESTIONS = 'LOAD_QUESTIONS';
const DELETE_QUESTION = 'DELETE_QUESTION';
const CREATE_QUESTION = 'CREATE_QUESTION';
const TOGGLE_LIKE = 'TOGGLE_LIKE';
const SET_NEW = 'SET_NEW';
const DESELECT_NEW = 'DESELECT_NEW';

const initialState = { questions: [], newQuestion: null };

// Helper Functions
const upvoteSort = (questions) => {
    return questions.sort((a, b) => a.likes.length < b.likes.length ? 1 : b.likes.length < a.likes.length ? -1 : 0)
}

// Action Creators
export const loadQuestions = (questions) => ({ type: LOAD_QUESTIONS, questions });
export const removeQuestion = (id) => ({ type: DELETE_QUESTION, id });
export const initQuestion = (question) => ({ type: CREATE_QUESTION, question });
export const likeToggle = (question) => ({ type: TOGGLE_LIKE, question });

// Thunks
export const fetchQuestions = (courseId) => {
  return async (dispatch) => {
    //console.log('hello', courseId);
    const questions = (await axios.get(`/api/questions/${courseId}`)).data;
    dispatch(loadQuestions(upvoteSort(questions)));
  };
};

export const deleteQuestion = (questionId, socket, room) => {
  return async (dispatch) => {
    await axios.delete(`/api/questions/delete/${questionId}`);
    socket.emit('deleteQuestion', room, questionId)
    dispatch(removeQuestion(questionId));
  };
};

export const toggleLike = (questionId, userId, isLiked, room, socket) => {
  return async (dispatch) => {
    if (isLiked) {
      await axios.delete('/api/likes/delete', {
        questionId: questionId,
        userId: userId,
      });
    } else {
      await axios.post('/api/likes/create', {
        questionId: questionId,
        userId: userId,
      });
    }

    const question = (await axios.get(`/api/questions/question/${questionId}`)).data;

    socket.emit('toggleLike', room, question)
    dispatch(likeToggle(question));
  };
};

export const createQuestion = (question, socket, room) => {
  return async (dispatch) => {
    const newQuestion = (await axios.post('/api/questions/create', question)).data;

    socket.emit('newQuestion', room, newQuestion)
    dispatch(initQuestion(newQuestion));
  };
};

// Reducer
export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_QUESTIONS:
      return { questions: action.questions };
    case DELETE_QUESTION:
      return {
        questions: state.questions.filter(
          (question) => question.id != action.id
        ),
      };
    case TOGGLE_LIKE:
      const questions = state.questions.filter(
        (question) => question.id !== action.question.id
      );
      const updatedQuestions = upvoteSort([...questions, action.question]);
      return { questions: updatedQuestions };
    case CREATE_QUESTION:
      return { questions: [...state.questions, action.question] };
    default:
      return state;
  }
}
