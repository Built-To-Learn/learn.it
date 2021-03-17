import axios from 'axios'

// Constants
const LOAD = 'LOAD'
const DELETE = 'DELETE'
const CREATE = 'CREATE'

const initialState = { questions: [] }

// Action Creators
export const loadQuestions = (questions) => ({ type: LOAD, questions })
export const removeQuestion = (question) => ({ type: DELETE, question })
export const initQuestion = (question) => ({ type: CREATE, question })

// Thunks
export const fetchQuestions = (courseId) => {
    return async (dispatch) => {
        const questions = (await axios.get(`/api/questions/${courseId}`)).data
        dispatch(loadQuestions(questions))
    }
}

export const deleteQuestion = (questionId) => {
    return async (dispatch) => {
        const question = (await axios.delete(`/api/questions/delete/${questionId}`)).data
        dispatch(removeQuestion(question))
    }
}

export const createQuestion = (question) => {
    return async (dispatch) => {
        const newQuestion = (await axios.post('/api/questions/create', question)).data
        dispatch(initQuestion(newQuestion))
    }
}

// Reducer
export default function (state=initialState, action) {
    switch (action.type) {
        case LOAD:
            return { questions: action.questions }
        case DELETE:
            return { questions: state.questions.filter(question => question !== action.question) }
        case CREATE:
            return { questions: [...state.questions, action.question] }
        default:
            return state
    }
}