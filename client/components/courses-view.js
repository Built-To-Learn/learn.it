import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { logout } from '../store'
import { loadCourses } from '../store/courses'
import M from 'materialize-css'

class CoursesView extends React.Component {
    constructor() {
        super()
        this.state = {
            courses: [],
        }
    }
    async componentDidMount() {
        console.log('mounting')
        this.props.getCourses()
    }

    render() {
        const courses = this.props.courses
        console.log(courses)

        return <div>hi</div>
    }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
    return {
        isLoggedIn: !!state.auth.id,
        courses: state.courses,
    }
}

const mapDispatch = (dispatch) => {
    return {
        getCourses: () => {
            dispatch(loadCourses())
        },
    }
}

export default connect(mapState, mapDispatch)(CoursesView)
