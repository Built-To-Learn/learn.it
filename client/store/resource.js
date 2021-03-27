import axios from 'axios'
/**
 * ACTION TYPES
 */
const LOAD_RESOURCES = 'LOAD_RESOURCES'

/**
 * ACTION CREATORS
 */

export const _loadResources = (resources) => ({
    type: LOAD_RESOURCES,
    resources,
})

/**
 * THUNK CREATORS
 */
//
export const loadResources = (courseTitle) => {
    return async (dispatch) => {
        const resources = (await axios.get(`/api/resource/${courseTitle}`)).data.Contents
        dispatch(_loadResources(resources))
    }
}

/**
 * REDUCER
 */
const initialState = []

export default function (state = initialState, action) {
    switch (action.type) {
        case LOAD_RESOURCES:
            return  action.resources

        default:
            return state
    }
}
