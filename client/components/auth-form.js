import React from 'react'
import { connect } from 'react-redux'
import { authenticate } from '../store'

const AuthForm = (props) => {
    const { name, displayName, handleSubmit, error } = props

    if(name === "login"){
        return (
            <div className="section container center-align" style={{width: "35%"}}>
                <h1 className="center-align">{name}</h1>
                <div className="z-depth-1 grey lighten-3 row"
                    style={{display: "inline-block", padding: "32px 48px 0px 48px"}} >

                    <form className="row" onSubmit={handleSubmit} name={name}>
                        <div className="col s12 input-field">
                            <label htmlFor="email">
                                <small>Email</small>
                            </label>
                            <input name="email" type="text" />
                        </div>
                        <div className="col s12 input-field validate">
                            <label htmlFor="password">
                                <small>Password</small>
                            </label>
                            <input name="password" type="password" />
                        </div>
                        <div>
                            <button className="btn" type="submit">{displayName}</button>
                        </div>
                        {error && error.response && <div> {error.response.data} </div>}
                    </form>
                </div>
                {window.githubURL && (
                    <a href={window.githubURL}>Login / Register Via Github </a>
                )}
            </div>
        )
    }

    if(name === "signup"){
        return (
            <div className="section container center-align" style={{width: "35%"}}>
                <h1 className="center-align">{name}</h1>
                <div className="z-depth-1 grey lighten-3 row"
                    style={{display: "inline-block", padding: "32px 48px 0px 48px"}} >

                    <form className="row" onSubmit={handleSubmit} name={name}>
                    <div className="col s12 input-field">
                            <label htmlFor="fullname">
                                <small>Full Name</small>
                            </label>
                            <input name="fullname" type="text" />
                        </div>
                        <div className="col s12 input-field">
                            <label htmlFor="username">
                                <small>Username</small>
                            </label>
                            <input name="username" type="text" />
                        </div>
                        <div className="col s12 input-field">
                            <label htmlFor="email">
                                <small>Email</small>
                            </label>
                            <input name="email" type="text" />
                        </div>
                        <div className="col s12 input-field">
                            <label htmlFor="password">
                                <small>Password</small>
                            </label>
                            <input name="password" type="password" />
                        </div>
                        <div>
                            <button className="btn" type="submit">{displayName}</button>
                        </div>
                        {error && error.response && <div> {error.response.data} </div>}
                    </form>
                </div>
                {window.githubURL && (
                    <a href={window.githubURL}>Login / Register Via Github </a>
                )}
            </div>
        )
    }


}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = (state) => {
    return {
        name: 'login',
        displayName: 'Login',
        error: state.auth.error,
    }
}

const mapSignup = (state) => {
    return {
        name: 'signup',
        displayName: 'Sign Up',
        error: state.auth.error,
    }
}

const mapDispatch = (dispatch) => {
    return {
        handleSubmit(evt) {
            evt.preventDefault()
            const formName = evt.target.name
            const email = evt.target.email.value
            const password = evt.target.password.value

            if(formName === "signup"){
                const username = evt.target.username.value
                const fullName = evt.target.fullname.value
                dispatch(authenticate(formName, email, password, fullName, username ))
            }

            if(formName === "login"){
                if(email && password){
                    dispatch(authenticate(formName, email, password ))
                }
            }


        },
    }
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)
