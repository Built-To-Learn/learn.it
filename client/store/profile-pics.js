import axios from 'axios'
/**
 * ACTION TYPES
 */

const LOAD_PROFILE_PIC = "LOAD_PROFILE_PIC"

/**
 * ACTION CREATORS
 */

export const _loadProfilePic = (picture) => ({
    type: LOAD_PROFILE_PIC,
    picture,
})

export const loadProfilePic = (username) => {
    return async (dispatch) => {
        console.log('fired off')
        const picture = (await axios.get(`/api/resource/profile-pic/${username}`)).data.Contents
        console.log("PICTURE",picture)
        dispatch(_loadProfilePic(picture))
    }
}

/**
 * REDUCER
 */
const initialState = []

export default function (state = initialState, action) {
    switch (action.type) {
        case LOAD_PROFILE_PIC:
            return action.picture
        default:
            return state
    }
}
