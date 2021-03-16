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

export const loadCourses = () => {
    return async (dispatch) => {
        const courses = (await axios.get('/api/courses')).data
        dispatch(_loadCourses(courses))
    }
}

export const loadUserCourses = () => {
    return async (dispatch) => {
        const token = window.localStorage.getItem('token')
        console.log('TOKEN', token)
        try {
            if (token) {
                console.log('INSIDE TRY')
                const courses = await axios.get(`/api/courses/user`, {
                    headers: {
                        authorization: token,
                    },
                }).data
                // const courses = await axios.get(`/api/courses/user`).data

                // console.log('COURSES', courses)
                // dispatch(_loadUserCourses(courses))
            }
        } catch (err) {
            console.log(err)
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

        case LOAD_USER_COURSES:
            return { courses: action.courses }

        default:
            return state
    }
}
