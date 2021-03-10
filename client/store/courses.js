import axios from 'axios'

/**
 * ACTION TYPES
 */
const CREATE_COURSE = 'CREATE_COURSE'

/**
 * ACTION CREATORS
 */
const _createCourse = (courseName, subject, category) => ({
    type: CREATE_COURSE,
    courseName,
    subject,
    category,
})

/**
 * THUNK CREATORS
 */
//
export const createCourse = (courseName, subject, category) => async (
    dispatch
) => {
    let res
    try {
        console.log('HELLO')
        let title = courseName
        res = await axios.post(`/api/courses`, { title, subject, category })
        dispatch(_createCourse(courseName, subject, category))
    } catch (err) {
        console.log(err)
    }
}
/**
 * REDUCER
 */
export default function (state = {}, action) {
    switch (action.type) {
        case CREATE_COURSE:
            return action.auth
        default:
            return state
    }
}
