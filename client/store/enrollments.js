import axios from 'axios'
const ENROLL_IN_COURSE = 'ENROLL_IN_COURSE'
const LOAD_ENROLLMENTS = 'LOAD_ENROLLMENTS'

export const _enrollInCourse = (enrollment) => ({
    type: ENROLL_IN_COURSE,
    enrollment,
})

export const _loadEnrollments = (enrollments) => ({
    type: LOAD_ENROLLMENTS,
    enrollments,
})

export const enrollInCourse = (courseId, userId, title) => {
    console.log('ENROLL IN COURSE', courseId, userId, title)
    try {
        return async (dispatch) => {
            console.log('enroll inside enroll')
            await axios.post(`/api/enrollments`, {
                courseId,
                userId,
            })

            dispatch(_enrollInCourse({ courseId: courseId, title: title }))
        }
    } catch (err) {
        console.log(err)
    }
}

export const loadEnrollments = (userId) => {
    return async (dispatch) => {
        const enrollments = (await axios.get(`/api/enrollments/${userId}`)).data
        console.log('ENROLLMENTS', enrollments)
        dispatch(_loadEnrollments(enrollments))
    }
}

const initialState = []

export default function (state = initialState, action) {
    switch (action.type) {
        case LOAD_ENROLLMENTS:
            console.log('ACTION', action)
            return action.enrollments
        case ENROLL_IN_COURSE:
            console.log(action.enrollment)
            return [...state, { course: action.enrollment }]
        // why is this undefeind
        default:
            return state
    }
}
