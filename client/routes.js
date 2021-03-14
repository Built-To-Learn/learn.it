import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter, Route, Switch, Redirect } from 'react-router-dom'
import {
    Login,
    Signup,
    Home,
    VideoChat,
    Dashboard,
    Parallax,
    Landing,
    Payment,
} from './components'
import { CreateNewCourse } from './components/createclass.js'
import { me } from './store'
import CoursesView from './components/courses-view.js'
import AssociatedCourses from './components/associated-courses.js'

/**
 * COMPONENT
 */
class Routes extends Component {
    componentDidMount() {
        this.props.loadInitialData()
    }

    render() {
        const { isLoggedIn } = this.props

        return (
            <div>
                {isLoggedIn ? (
                    <Switch>
                        <Route exact path="/home" component={Landing} />
                        <Route
                            exact
                            path="/createcourse"
                            component={CreateNewCourse}
                        />
                        <Route
                            exact
                            path="/viewcourses"
                            component={CoursesView}
                        />
                        {/* <Route path="/dashboard" component={Dashboard} /> */}
                        <Redirect to="/home" />
                    </Switch>
                ) : (
                    <Switch>
                        <Route path="/" exact component={Parallax} />
                        <Route path="/login" exact component={Login} />
                        <Route path="/signup" exact component={Signup} />
                        {/* <Route path="/videochat" component={VideoChat} /> */}
                        {/* <Route path="/landing" component={Landing} /> */}
                        <Route
                            exact
                            path="/createcourse"
                            component={CreateNewCourse}
                        />
                        <Route exact path="/tip" component={Payment} />
                    </Switch>
                )}
            </div>
        )
    }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
    return {
        // Being 'logged in' for our purposes will be defined has having a state.auth that has a truthy id.
        // Otherwise, state.auth will be an empty object, and state.auth.id will be falsey
        isLoggedIn: !!state.auth.id,
    }
}

const mapDispatch = (dispatch) => {
    return {
        loadInitialData() {
            dispatch(me())
        },
    }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))
