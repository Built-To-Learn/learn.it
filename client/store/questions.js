import axios from 'axios'

// Constants
const LOAD_QUESTIONS = 'LOAD_QUESTIONS'
const DELETE_QUESTION = 'DELETE_QUESTION'
const CREATE_QUESTION = 'CREATE_QUESTION'
const UPDATE_QUESTION = 'UPDATE_QUESTION'

const initialState = { questions: [] }

// Helper Functions
const upvoteSort = (questions) => {
    return questions.sort((a, b) => a.upvotes < b.upvotes ? 1 : b.upvotes < a.upvotes ? -1 : 0)
}

// Action Creators
export const loadQuestions = (questions) => ({ type: LOAD_QUESTIONS, questions })
export const removeQuestion = (question) => ({ type: DELETE_QUESTION, question })
export const initQuestion = (question) => ({ type: CREATE_QUESTION, question })
export const updateQuestion = (question) => ({ type: UPDATE_QUESTION, question })

// Thunks
export const fetchQuestions = (courseId) => {
    return async (dispatch) => {
        const questions = (await axios.get(`/api/questions/${courseId}`)).data
        dispatch(loadQuestions(upvoteSort(questions)))
    }
}

export const deleteQuestion = (questionId) => {
    return async (dispatch) => {
        const question = (await axios.delete(`/api/questions/delete/${questionId}`)).data
        dispatch(removeQuestion(question))
    }
}

export const changeQuestion = (questionId, type) => {
    return async (dispatch) => {
        const question = (await axios.put(`/api/questions/update/${questionId}`, {modifier: type === 'increment' ? 1 : -1})).data
        dispatch(updateQuestion(question))
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
        case LOAD_QUESTIONS:
            return { questions: action.questions }
        case DELETE_QUESTION:
            return { questions: state.questions.filter(question => question !== action.question) }
        case UPDATE_QUESTION:
            const questions = state.questions.filter(question => question.id !== action.question.id)
            const updatedQuestions = upvoteSort([...questions, action.question])
            return { questions: updatedQuestions }
        case CREATE_QUESTION:
            return { questions: [...state.questions, action.question] }
        default:
            return state
    }
}