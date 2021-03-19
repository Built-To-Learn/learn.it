import axios from 'axios'

/**
 * ACTION TYPES
 */
const CREATE_COURSE = 'CREATE_COURSE'
const LOAD_COURSES = 'LOAD_COURSES'
const LOAD_USER_COURSES = 'LOAD_USER_COURSES'

/**
 * ACTION CREATORS
 */
const _createCourse = (course) => ({
    type: CREATE_COURSE,
    course,
})

export const _loadCourses = (courses) => ({ type: LOAD_COURSES, courses })

export const _loadUserCourses = (courses) => ({
    type: LOAD_USER_COURSES,
    courses,
})

/**
 * THUNK CREATORS
 */
//
export const createCourse = (courseObj) => async (dispatch) => {
    let res
    try {
        const token = window.localStorage.getItem('token')
        if (token) {
            const course = (
                await axios.post(`/api/courses`, courseObj, {
                    headers: {
                        authorization: token,
                    },
                })
            ).data
            //courseObj = { ...courseObj, id: uuid };
            dispatch(_createCourse(course))
        }
    } catch (err) {
        console.log(err)
    }
}

export const loadCourses = () => {
    return async (dispatch) => {
        const courses = (await axios.get('/api/courses')).data
        dispatch(_loadCourses(courses))
    }
}

export const loadUserCourses = () => {
    return async (dispatch) => {
        const token = window.localStorage.getItem('token')
        try {
            if (token) {
                const courses = (
                    await axios.get(`/api/courses/user`, {
                        headers: {
                            authorization: token,
                        },
                    })
                ).data
                dispatch(_loadUserCourses(courses))
            }
        } catch (err) {
            console.log(err)
        }
    }
}

/**
 * REDUCER
 */
const initialState = { all: [], user: [] }

export default function (state = initialState, action) {
    switch (action.type) {
        case CREATE_COURSE:
            return {
                all: [...state.all, action.course],
                user: [...state.user, action.course],
            }

        case LOAD_COURSES:
            return { ...state, all: action.courses }

        case LOAD_USER_COURSES:
            return { ...state, user: action.courses }

        default:
            return state
    }
}
