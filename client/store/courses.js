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
        await axios.post(`/api/courses`, courseObj)
        dispatch(_createCourse(courseObj))
    } catch (err) {
        console.log(err)
    }
}

// export const fetchCourses = async (dispatch) => {
//     const courses = await axios.get('/api/courses').data
//     dispatch(setCourses(courses))
// }

export const loadCourses = () => {
    console.log('fetch')
    return async (dispatch) => {
        console.log('inside fetch')
        const courses = (await axios.get('/api/courses')).data
        dispatch(_loadCourses(courses))
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
