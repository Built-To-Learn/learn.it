import axios from 'axios'

/**
 * ACTION TYPES
 */
const CREATE_COURSE = 'CREATE_COURSE'
const LOAD_COURSES = 'LOAD_COURSES'

/**
 * ACTION CREATORS
 */
const _createCourse = (course) => ({
    type: CREATE_COURSE,
    course,
})

export const _loadCourses = (courses) => ({ type: LOAD_COURSES, courses })

/**
 * THUNK CREATORS
 */
//
export const createCourse = (courseObj) => async (dispatch) => {
    let res
    try {
        console.log('HELLO')
        const token = window.localStorage.getItem('token')
        if (token) {
            await axios.post(`/api/courses`, courseObj, {
                headers: {
                    authorization: token,
                },
            })
            dispatch(_createCourse(courseObj))
        }
    } catch (err) {
        console.log(err)
    }
}

export const loadCourses = (userId = null) => {
    console.log('fetch')
    if (userId === null) {
        return async (dispatch) => {
            const courses = (await axios.get('/api/courses')).data
            console.log('COURSES', courses)
            dispatch(_loadCourses(courses))
        }
    } else {
        return async (dispatch) => {
            const courses = (await axios.get(`/api/courses/${userId}`)).data
            dispatch(_loadCourses(courses))
        }
    }
}

/**
 * REDUCER
 */
const initialState = {
    courses: [],
}

export default function (state = initialState, action) {
    switch (action.type) {
        case CREATE_COURSE:
            return { ...state, courses: [...state.courses, action.course] }

        case LOAD_COURSES:
            return { courses: action.courses }

        default:
            return state
    }
}
