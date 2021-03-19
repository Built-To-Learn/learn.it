import axios from 'axios'

/**
 * ACTION TYPES
 */
const LOAD_SINGLE_COURSE = 'LOAD_SINGLE_COURSE'

/**
 * ACTION CREATORS
 */

export const _loadSingleCourse = (singleCourse) => ({
    type: LOAD_SINGLE_COURSE,
    singleCourse,
})

/**
 * THUNK CREATORS
 */
//
export const loadSingleCourse = (singleCourse) => {
    return async (dispatch) => {
        dispatch(_loadSingleCourse(singleCourse))
    }
}

/**
 * REDUCER
 */
const initialState = {}

export default function (state = initialState, action) {
    switch (action.type) {
        case LOAD_SINGLE_COURSE:
            return action.singleCourse

        default:
            return state
    }
}
