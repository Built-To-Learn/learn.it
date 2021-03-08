import React from 'react'
import { connect } from 'react-redux'
import { authenticate } from '../store'

/**
 * COMPONENT
 */
const StudentAuthForm = (props) => {
    const { name, displayName, handleSubmit, error } = props

    return (
        <div>
            <form onSubmit={handleSubmit} name={name}>
                <div>
                    <label htmlFor="email">
                        <small>Student Email</small>
                    </label>
                    <input name="email" type="text" />
                </div>
                <div>
                    <label htmlFor="password">
                        <small>Password</small>
                    </label>
                    <input name="password" type="password" />
                </div>
                <div>
                    <button type="submit">{displayName}</button>
                </div>
                {error && error.response && <div> {error.response.data} </div>}
            </form>
            {window.githubURL && (
                <a href={window.githubURL}>Login / Register Via Github </a>
            )}
        </div>
    )
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapStudentLogin = (state) => {
    return {
        name: 'login',
        displayName: 'Login',
        error: state.auth.error,
    }
}

const mapStudentSignup = (state) => {
    return {
        name: 'signup',
        displayName: 'Sign Up',
        error: state.auth.error,
    }
}

const mapStudentDispatch = (dispatch) => {
    return {
        handleSubmit(evt) {
            evt.preventDefault()
            const formName = evt.target.name
            const email = evt.target.email.value
            const password = evt.target.password.value
            dispatch(authenticate(email, password, formName))
        },
    }
}

export const StudentLogin = connect(
    mapStudentLogin,
    mapStudentDispatch
)(StudentAuthForm)
export const StudentSignup = connect(
    mapStudentSignup,
    mapStudentDispatch
)(StudentAuthForm)
