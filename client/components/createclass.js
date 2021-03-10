import React from 'react'
import { connect } from 'react-redux'
import { authenticate } from '../store'
import Parallax from './parallax.js'
import Icons from './icons.js'
/**
 * COMPONENT
 */
const CreateClass = (props) => {
    const { handleSubmit, error, isLoggedIn } = props

    console.log(props)

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <form onSubmit={handleSubmit} name={name}>
                        <div>
                            <label htmlFor="classname">
                                <small>Class Name</small>
                            </label>
                            <input name="classname" type="text" />
                        </div>
                        <div>
                            <label htmlFor="Subject">
                                <small>Subject</small>
                            </label>
                            <input name="subject" type="text" />
                        </div>
                        <div>
                            <button type="submit">Create Class</button>
                        </div>
                        {error && error.response && (
                            <div> {error.response.data} </div>
                        )}
                    </form>
                    {window.githubURL && (
                        <a href={window.githubURL}>
                            Login / Register Via Github{' '}
                        </a>
                    )}
                </div>
            ) : (
                <p>Must Be Logged In to Create a Class</p>
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
// const mapLogin = (state) => {
//     return {
//         name: 'login',
//         displayName: 'Login',
//         error: state.auth.error,
//     }
// }

const mapCreateClass = (state) => {
    return {
        name: 'signup',
        displayName: 'Sign Up',
        error: state.auth.error,
        isLoggedIn: !!state.auth.id,
    }
}

const mapDispatch = (dispatch) => {
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

export const CreateNewClass = connect(mapCreateClass, mapDispatch)(CreateClass)
// export const Signup = connect(mapCreateClass, mapDispatch)(CreateClass)
