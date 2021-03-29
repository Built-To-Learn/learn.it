import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout } from '../store'
import { fetchView } from '../store/view'

const Navbar = ({ handleClick, isLoggedIn, fetchView }) => (
    <nav role="navigation">
        {isLoggedIn ? (
            <div className="nav-wrapper container">
                {/* The navbar will show these links after you log in */}
                <Link id="logo-container" onClick={() => fetchView("welcome")} className="brand-logo">
                    Learn.it
                </Link>
                <ul className="right hide-on-med-and-down ">
                    <li>
                        <Link to="/#" onClick={handleClick}>
                            Logout
                        </Link>
                    </li>
                    <li>
                        <Link to="/Dashboard">Dashboard</Link>
                    </li>
                </ul>
            </div>
        ) : (
            <div className="nav-wrapper container">
                {/* The navbar will show these links before you log in */}
                <Link id="logo-container" to="/" className="brand-logo">
                    Learn.it
                </Link>
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
        fetchView: (view) => dispatch(fetchView(view))
    }
}

export default connect(mapState, mapDispatch)(Navbar)
