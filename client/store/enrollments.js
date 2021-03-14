import axios from 'axios'
const ENROLL_IN_COURSE = 'ENTROLL IN COURSE'

export const _enrollInCourse = (enrollment) => ({
    type: ENROLL_IN_COURSE,
    enrollment,
})

export const enrollInCourse = (courseId, userId) => {
    console.log('ENROLL IN COURSE', courseId, userId)
    try {
        return async () => {
            console.log('enroll inside enroll')
            await axios.post(`/api/enrollments`, {
                courseId: courseId,
                userId: userId,
            })
        }
    } catch (err) {
        console.log(err)
    }
}

const initialState = {
    enrollments: [],
}

export default function (state = initialState, action) {
    switch (action.type) {
        // case ENROLL_IN_COURSE:
        //     return { ...state, courses: [...state.courses, action.course] }

        default:
            return state
    }
}
