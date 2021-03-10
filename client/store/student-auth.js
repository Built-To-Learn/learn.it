import axios from 'axios'
import history from '../history'

const storage = () => window.localStorage
const TOKEN = 'token'

/**
 * ACTION TYPES
 */
const SET_STUDENT_AUTH = 'SET_STUDENT_AUTH'

/**
 * ACTION CREATORS
 */
const setStudentAuth = (auth) => ({ type: SET_STUDENT_AUTH, auth })

/**
 * THUNK CREATORS
 */
export const me = () => async (dispatch) => {
    const token = storage().getItem(TOKEN)
    if (token) {
        console.log(token)
        const res = await axios.get('/auth/student/me', {
            headers: {
                authorization: token,
            },
        })

        console.log(res)
        return dispatch(setStudentAuth(res.data))
    }
}

export const studentAuthenticate = (email, password, method) => async (
    dispatch
) => {
    let res
    try {
        res = await axios.post(`/auth/student/${method}`, { email, password })
        storage().setItem(TOKEN, res.data.token)
        dispatch(me())
    } catch (authError) {
        return dispatch(setAuth({ error: authError }))
    }
}

export const logout = () => {
    storage().removeItem(TOKEN)
    history.push('/login')
    return {
        type: SET_STUDENT_AUTH,
        auth: {},
    }
}

/**
 * REDUCER
 */
export default function (state = {}, action) {
    switch (action.type) {
        case SET_STUDENT_AUTH:
            return action.auth
        default:
            return state
    }
}
