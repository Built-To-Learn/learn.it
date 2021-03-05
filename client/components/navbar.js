import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout } from '../store'

const Navbar = ({ handleClick, isLoggedIn }) => (
    <nav role="navigation">
        {isLoggedIn ? (
            <div className="nav-wrapper container">
                {/* The navbar will show these links after you log in */}
                <a id="logo-container" href="#" className="brand-logo">
                    Learn.it
                </a>
                <Link to="/home">Home</Link>
                <a href="#" onClick={handleClick}>
                    Logout
                </a>
            </div>
        ) : (
            <div className="nav-wrapper container">
                {/* The navbar will show these links before you log in */}
                <a id="logo-container" href="#" className="brand-logo">
                    Learn.it
                </a>
                <ul className="right hide-on-med-and-down ">
                    <li>
                        {/* <a href="#">Navbar Link</a> */}
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/signup">Sign Up</Link>
                    </li>
                </ul>
            </div>
        )}
    </nav>
)

/**
 * CONTAINER
 */
const mapState = (state) => {
    return {
        isLoggedIn: !!state.auth.id,
    }
}

const mapDispatch = (dispatch) => {
    return {
        handleClick() {
            dispatch(logout())
        },
    }
}

export default connect(mapState, mapDispatch)(Navbar)
